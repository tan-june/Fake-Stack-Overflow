let Tag = require('./tags')
let Answer = require('./answers')
let Question = require('./questions')
let User = require('./UserSchema')
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const e = require('express');

//Question Data Pull
async function getAllQuestions() {
    try {
        const questions = await Question.find().populate('tags');
        return questions.map((question) => ({
            ...question._doc,
            ask_date_time: formatDateTime(question.ask_date_time),
        }));
    } catch (error) {
        throw error;
    }
}

async function getQuestionById(questionId) {
    try {
        await deleteUnusedTags();

        const question = await Question.findByIdAndUpdate(
            questionId,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('tags').populate({
            path: 'answers',
            populate: { path: 'ans_date_time' },
        });

        if (!question) {
            return null;
        }

        const formattedQuestion = {
            ...question._doc,
            ask_date_time: formatDateTime(question.ask_date_time),
        };

        formattedQuestion.answers = question.answers.map((answer) => ({
            ...answer._doc,
            ans_date_time: formatDateTime(answer.ans_date_time),
            answers: question.answers.map((answer) => ({
                ...answer._doc,
                ans_date_time: formatDateTime(answer.ans_date_time),
            })),
        }));

        return formattedQuestion;
    } catch (error) {
        throw error;
    }
}

async function getQuestionByIdUpdate(questionId) {
    await deleteUnusedTags();
    try {
        const question = await Question.findById(questionId)
            .populate('tags')
            .populate({
                path: 'answers',
                populate: { path: 'ans_date_time' },
            });

        if (!question) {
            return null;
        }

        const formattedQuestion = {
            ...question._doc,
            ask_date_time: formatDateTime(question.ask_date_time),
        };

        formattedQuestion.answers = question.answers.map((answer) => ({
            ...answer._doc,
            ans_date_time: formatDateTime(answer.ans_date_time),
            answers: question.answers.map((answer) => ({
                ...answer._doc,
                ans_date_time: formatDateTime(answer.ans_date_time),
            })),
        }));

        return formattedQuestion;
    } catch (error) {
        throw error;
    }
}



async function getUnansweredQuestions() {
    try {
        const unansweredQuestions = await Question.find({ answers: { $size: 0 } }).populate('tags');
        return unansweredQuestions.map((question) => ({
            ...question._doc,
            ask_date_time: formatDateTime(question.ask_date_time),
        }));
    } catch (error) {
        throw error;
    }
}

async function getActiveQuestions() {
    try {
        const answeredQuestions = await Question.find({ answers: { $exists: true, $not: { $size: 0 } } })
            .populate('tags')
            .populate({
                path: 'answers',
                options: { sort: { ans_date_time: -1 } }
            });

        const unansweredQuestions = await Question.find({ answers: { $size: 0 } }).populate('tags');

        for (const question of unansweredQuestions) {
            answeredQuestions.push(question);
        }

        return answeredQuestions.map((question) => ({
            ...question._doc,
            ask_date_time: formatDateTime(question.ask_date_time),
        }));
    } catch (error) {
        throw error;
    }
}


async function createQuestion(title, summary, text, tags, sessionID, userIDhash) {
    try {
        const check = await this.findSession(sessionID);


        const newQuestion = new Question({
            title: title,
            qsummary: summary,
            text: text,
            tags: tags,
            asked_by: check.username,
            answers: [],
            ask_date_time: new Date(),
            views: 0,
        });

        const savedQuestion = await newQuestion.save();

        return savedQuestion;

    } catch (error) {
        throw error;
    }
}


//    await getData.addAnswer(questionId, text, req.cookies.fake_so_securesessionval, req.cookies.values_88242);

async function addAnswer(questionId, text, sessionID, userIDhash) {
    try {
        // //console.log(sessionID);
        const check = await this.findSession(sessionID);
        // //console.log(check);
        const userCheck = await bcrypt.hash('devkey', 10);
        // //console.log(userIDhash)
        // //console.log(userCheck)

        if (check && (userCheck && userIDhash)) {
            const newAnswer = new Answer({
                ans_by: check.username,
                text: text,
                answer_date_time: new Date(),
            });

            const savedAnswer = await newAnswer.save();

            await addAnswerToQuestion(questionId, savedAnswer._id);

            return savedAnswer;

        }
        else {
            throw error;
        }

    } catch (error) {
        throw error;
    }
}

async function addAnswerToQuestion(questionId, answerId) {
    try {
        const question = await Question.findByIdAndUpdate(questionId, { $push: { answers: answerId } }, { new: true });
        return question;
    } catch (error) {
        throw error;
    }
}



function formatDateTime(dateString) {
    const questionDate = new Date(dateString);
    const currentDate = new Date();

    const timeDifferenceInSeconds = Math.floor((currentDate - questionDate) / 1000);

    if (timeDifferenceInSeconds < 60) {
        return `${timeDifferenceInSeconds} second(s) ago`;
    } else if (timeDifferenceInSeconds < 3600) {
        const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
        return `${minutesAgo} minute(s) ago`;
    } else if (timeDifferenceInSeconds < 86400) {
        const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
        return `${hoursAgo} hour(s) ago`;
    } else if (currentDate.getFullYear() === questionDate.getFullYear()) {
        return questionDate.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return questionDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

async function newQuestionTagCheck(tagsArray, userrep) {
    try {
        const finalTags = [];

        for (const tagName of tagsArray) {
            const existingTag = await Tag.findOne({ name: tagName });

            if (existingTag) {
                finalTags.push(existingTag._id);
            } else {
                let tagToAdd;

                if (userrep >= 50) {
                    const newTag = new Tag({ name: tagName });
                    const savedTag = await newTag.save();
                    tagToAdd = savedTag._id;
                } else {
                    const miscTag = await createMiscTag();
                    tagToAdd = miscTag._id;
                }

                finalTags.push(tagToAdd);
            }
        }

        const uniqueFinalTags = finalTags.filter((tag, index, self) =>
        index === self.findIndex((t) => t.equals(tag))
        );

        // //console.log("tagger", uniqueFinalTags);
        return uniqueFinalTags;

        return uniqueFinalTags;
    } catch (error) {
        throw error;
    }
}

async function createMiscTag() {
    try {
        const miscTag = await Tag.findOne({ name: 'misc' });
        if (!miscTag) {
            const newMiscTag = new Tag({ name: 'misc' });
            await newMiscTag.save();
            return newMiscTag;
        }
        return miscTag;
    } catch (error) {
        console.error('Error creating "Misc" tag:', error);
    }
}


async function getAllTags() {
    try {
        await deleteUnusedTags();
        const tags = await Tag.find();
        const tagsWithQuestionCount = [];

        for (const tag of tags) {
            const questionCount = await Question.countDocuments({ tags: tag._id });
            const tagObject = { name: tag.name, _id: tag._id, count: questionCount };
            // ////console.log(tag._id);
            tagsWithQuestionCount.push(tagObject);
        }

        return tagsWithQuestionCount;
    } catch (error) {
        throw error;
    }
}

async function searchData(searchQuery) {
    try {
        //console.log('Search Query:', searchQuery);
        const searchTerms = searchQuery.split(' ').map((term) => term.toLowerCase());
        //console.log(searchTerms)
        const searchResults = [];

        for (const term of searchTerms) {
            if (term.startsWith('[') && term.endsWith(']')) {
                const tags = term.slice(1, -1).split(' ');
                const tagIds = await Tag.find({ name: { $in: tags } }, '_id');
                const tagIdArray = tagIds.map((tag) => tag._id);
                const tagSearch = await Question.find({ tags: { $in: tagIdArray } }).populate('tags');

                searchResults.push(...tagSearch.map((question) => {
                    const formattedQuestion = {
                        ...question._doc,
                        ask_date_time: question.ask_date_time ? formatDateTime(question.ask_date_time) : undefined,
                    };
                    return formattedQuestion;
                }));
            } else {
                const textSearch = await Question.find({ $text: { $search: term.toLowerCase() } }).populate('tags');
                searchResults.push(...textSearch.map((question) => {
                    const formattedQuestion = {
                        ...question._doc,
                        ask_date_time: question.ask_date_time ? formatDateTime(question.ask_date_time) : undefined,
                    };
                    return formattedQuestion;
                }));
            }
        }

        const uniqueSearchResults = [];
        for (const result of searchResults) {
            if (!uniqueSearchResults.some((uniqueResult) => (uniqueResult.text.toLowerCase() === result.text.toLowerCase()) && (uniqueResult.title.toLowerCase() === result.title.toLowerCase()))) {
                uniqueSearchResults.push(result);
            }
        }

        return uniqueSearchResults;
    } catch (error) {
        console.error('Error during search:', error);
        throw error;
    }
}


async function getQuestionsByTag(tagId) {
    try {
        const questions = await Question.find({ tags: tagId }).populate('tags');
        return questions.map((question) => ({
            ...question._doc,
            ask_date_time: formatDateTime(question.ask_date_time),
        }));
    } catch (error) {
        throw error;
    }
}



async function newRegister(username, email, password) {
    try {
        ////console.log("In getDataFile", email);
        ////console.log("In getDataFile", username);
        ////console.log("In getDataFile", password);

        const existingEmail = await User.findOne({ email: email });

        if (existingEmail) {
            ////console.log("existing error");
            return { status: 400, user: null };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        return { status: 200, user: savedUser };

    } catch (error) {
        return { status: 400, user: null };
    }
}

async function loginAttempt(email, password) {
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            ////console.log("User not found");
            return { status: 400, user: null };
        }
        const matches = await bcrypt.compare(password, user.password);

        if (matches) {
            ////console.log("Login successful");
            return { status: 200, user: user };
        } else {
            ////console.log("Password does not match");
            return { status: 400, user: null };
        }

    } catch (error) {
        console.error('Error during login:', error);
        return { status: 500, user: null };
    }
}

async function generateSession(email) {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            //console.log('User not found');
            return;
        }
        const hashedSessionId = await bcrypt.hash(uuidv4(), 10);
        user.sessions = hashedSessionId;
        await user.save();

        const hashUsedID = await bcrypt.hash('devkey', 10);

        // //console.log(user);
        // //console.log("GetData Session ID", hashedSessionId);

        return ({ sessionHash: hashedSessionId, userHashed: hashUsedID });
    } catch (error) {
        throw error;
    }
}

async function findSession(sessionVal) {
    try {
        // //console.log('Searching for session:', sessionVal);
        const user = await User.findOne({ sessions: { $in: [sessionVal] } });
        // //console.log('User found:', user);
        if (user) {
            return user;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        throw error;
    }
}


async function QuestionDownvote(questionID) {
    try {
        const question = await Question.findByIdAndUpdate(
            questionID,
            { $inc: { questionrep: -1 } },
            { new: true }
        );
        await this.updateUserReputationByUsername(question.asked_by, -10);
        return question;
    } catch (error) {
        throw error;
    }
}

async function QuestionUpvote(questionID) {
    try {
        const question = await Question.findByIdAndUpdate(
            questionID,
            { $inc: { questionrep: 1 } },
            { new: true }
        );
        await this.updateUserReputationByUsername(question.asked_by, 5);
        return question;
    } catch (error) {
        throw error;
    }
}

async function AnswerUpvote(answerID) {
    try {
        const answer = await Answer.findByIdAndUpdate(
            answerID,
            { $inc: { answerrep: 1 } },
            { new: true }
        );
        await this.updateUserReputationByUsername(answer.ans_by, 5);
        return answer;
    } catch (error) {
        throw error;
    }
}

async function AnswerDownVote(answerID, user) {
    try {
        const answer = await Answer.findByIdAndUpdate(
            answerID,
            { $inc: { answerrep: -1 } },
            { new: true }
        );
        await this.updateUserReputationByUsername(answer.ans_by, -10);
        return answer;
    } catch (error) {
        throw error;
    }
}

async function updateUserReputationByUsername(username, reputationIncrement) {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: username },
            { $inc: { userrep: reputationIncrement } },
            { new: true }
        );
        return updatedUser;
    } catch (error) {
        console.error('Error updating user reputation:', error);
        throw error;
    }
}


async function commentUpvote(answerID, commentID) {
    try {
        const answer = await Answer.findById(answerID);

        const updatedComments = answer.comments.map((comment) => {
            if (comment._id.equals(commentID)) {
                return {
                    ...comment.toObject(),
                    reputation: comment.reputation + 1,
                };
            }
            return comment;
        });


        const answerWithUpdatedComments = await Answer.findByIdAndUpdate(
            answerID,
            { $set: { comments: updatedComments } },
            { new: true }
        );

        await this.updateUserReputationByUsername(await answer.comments.find(comment => comment._id.toString() === commentID).comment_by, 5);

        return answerWithUpdatedComments;
    } catch (error) {
        throw error;
    }
}

async function commentUpvoteQ(questionID, commentID) {
    try {
        // //console.log("Im in the function");
        const question = await Question.findById(questionID);

        const updatedComments = question.comments.map((comment) => {
            if (comment._id.equals(commentID)) {
                return {
                    ...comment.toObject(),
                    reputation: comment.reputation + 1,
                };
            }
            return comment;
        });

        const answerWithUpdatedComments = await Question.findByIdAndUpdate(
            questionID,
            { $set: { comments: updatedComments } },
            { new: true }
        );
        await this.updateUserReputationByUsername(await question.comments.find(comment => comment._id.toString() === commentID).comment_by, 5);
        return answerWithUpdatedComments;
    } catch (error) {
        throw error;
    }
}

async function addCommentToAnswer(answerID, commentText, commentBy) {
    try {
        const answer = await Answer.findById(answerID);

        if (!answer) {
            throw new Error('Answer not found');
        }
        answer.comments.push({ text: commentText, comment_by: commentBy });
        await answer.save();
    }
    catch (error) {
        throw error;
    }
}

async function addCommentToQuestion(questionID, commentText, commentBy) {
    try {
        const question = await Question.findById(questionID);

        if (!question) {
            throw new Error('Question not found');
        }
        question.comments.push({ text: commentText, comment_by: commentBy });
        await question.save();
    }
    catch (error) {
        throw error;
    }
}

async function deleteSessiononUser(user) {
    try {
        // //console.log("deleting user")
        const userFind = await User.findById(user._id);
        userFind.sessions = '';
        // //console.log("Values", userFind.sessions)
        await userFind.save();
    }
    catch (error) {
        throw error
    }
}

async function getQuestionByUser(username) {
    try {
        const questions = await Question.find({ asked_by: username }).populate('tags');
        return questions.map((question) => ({
            ...question._doc,
            ask_date_time: formatDateTime(question.ask_date_time),
        }));
    } catch (error) {
        throw error;
    }
}



async function updateQuestion(questionId, title, summary, text, tags, userrep) {
    try {
        // //console.log("rep", userrep);
        const question = await Question.findById(questionId);

        if (!question) {
            throw new Error("Question not found");
        }

        question.title = title;
        question.text = text;
        question.qsummary = summary;
        question.tags = await newQuestionTagCheck(tags, userrep);

        await question.save();

        return "Success";
    } catch (error) {
        throw error;
    }
}


async function deleteQuestion(questionId) {
    try {

        const deletedQuestion = await Question.findByIdAndDelete(questionId);

        if (!deletedQuestion) {
            throw new Error('Question not found');
        }

        await Answer.deleteMany({ _id: { $in: deletedQuestion.answers } });

        return 'Question deleted successfully';
    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    try {
        const users = await User.find();
        return users.map((user) => ({
            ...user._doc,
        }));
    } catch (error) {
        throw error;
    }
}

async function getAnsweredQuestionsByUser(username) {
    try {
        const answers = await Answer.find({ ans_by: username });
        console.log('Answers:', answers);

        const questionIds = [...new Set(answers.map(answer => answer._id))];

        const questions = await Question.find({ answers: { $in: questionIds } }).populate('tags').populate({
            path: 'answers',
            populate: { path: 'ans_date_time' },
        });

        const formattedQuestions = questions.map((question) => ({
            ...question._doc,
            ask_date_time: formatDateTime(question.ask_date_time),
        }));

        return formattedQuestions;
    } catch (error) {
        console.error('Error in getAnsweredQuestionsByUser:', error);
        throw error;
    }
}




async function getTagsByUser(username) {
    try {
        //console.log('Inside getTagsByUser');
     
        const userQuestions = await Question.find({ asked_by: username }).populate('tags');

        const tagCounts = {};

        userQuestions.forEach(question => {
            question.tags.forEach(tag => {
                const tagId = tag._id.toString();
                if (!tagCounts[tagId]) {
                    tagCounts[tagId] = { _id: tag._id, name: tag.name, count: 1 };
                } else {
                    tagCounts[tagId].count++;
                }
            });
        });

        const userTags = Object.values(tagCounts);

        //console.log('User Tags:', userTags);
        return userTags;
    } catch (error) {
        throw error;
    }
}

async function onlyUserWithTag(username, tagId) {
    try {
        const questionsWithThisTag = await Question.find({ tags: tagId });
        const uniqueUsersWithThisTag = new Set(questionsWithThisTag.map(question => question.asked_by));

        // Exclude the current user from the check
        uniqueUsersWithThisTag.delete(username);

        return uniqueUsersWithThisTag.size === 0;
    } catch (error) {
        console.error('Error checking if user is the only one with the tag:', error);
        throw error;
    }
}

async function deleteUserTags(tagId, currentUser) {
    try {
        const isUserOnly = await onlyUserWithTag(currentUser.username, tagId);

        if (isUserOnly) {
            const userQuestions = await Question.find({
                asked_by: currentUser.username,
                tags: tagId,
            });

            const updatedQuestions = await Promise.all(
                userQuestions.map(async (question) => {
                    question.tags = question.tags.filter((tag) => !tag.equals(tagId));
                    return question.save();
                })
            );

            return { success: true, message: 'User-specific tags deleted successfully' };
        } else {
            throw new Error('User is not the only one using this tag');
        }
    } catch (error) {
        console.error('Error deleting user-specific tags:', error.message);
        throw new Error('Internal Server Error');
    }
}

async function updateUserTags(tagId, newName, currentUser) {
    try {
        const isUserOnly = await onlyUserWithTag(currentUser.username, tagId);

        if (isUserOnly) {
            const tagToUpdate = await Tag.findById(tagId);

            if (!tagToUpdate) {
                console.error(`Tag with ID ${tagId} not found`);
                return { success: false, message: 'Tag not found' };
            }

            //console.log('Found tag:', tagToUpdate);

            tagToUpdate.name = newName;

            const updatedTag = await tagToUpdate.save();

            //console.log('Tag name updated successfully:', updatedTag);

            return { success: true, message: 'Tag name updated successfully', updatedTag };
        } else {
            throw new Error('User is not the only one using this tag');
        }
    } catch (error) {
        console.error('Error updating tag name:', error.message);
        throw new Error('Internal Server Error');
    }
}
  

async function updateAnswer(answerID,text) {
    try {
        const answer = await Answer.findById(answerID);

        if (!answer) {
            throw new Error("Answer not found");
        }

        answer.text = text;

        await answer.save();

        return "Success";
    } catch (error) {
        throw error;
    }
}


async function deleteAnswer(answerId) {
    try {
        const deletedAnswer = await Answer.findByIdAndDelete(answerId);

        await Question.updateOne(
            { answers: answerId },
            { $pull: { answers: answerId } }
        );

        // //console.log("Deleted Answer:", deletedAnswer);
        return deletedAnswer;
    } catch (error) {
        throw error;
    }
}

async function getAnswerTextById(answerId) {
    try {
        const answer = await Answer.findById(answerId);
        if (!answer) {
            return null; // Or throw an error if you prefer
        }
        //console.log('Answer text from getData:', answer.text);
        return answer.text;
    } catch (error) {
        throw error;
    }
}

const deleteUser = async (userId) => {
    try {
        //console.log(userId);
      const user = await User.findById(userId);
      const usernameToDelete = user.username;
  
      await Question.deleteMany({ asked_by: usernameToDelete });
      await Answer.deleteMany({ ans_by: usernameToDelete });

      await User.findByIdAndDelete(userId);
  
      return { success: true, message: 'User and associated data deleted successfully' };
    } catch (error) {
      console.error('Error deleting user and associated data:', error.message);
      throw new Error('Internal Server Error');
    }
};

async function findUserForAdmin(id) {
    try {
      const user = await User.findById(id);
    //   //console.log('Found user:', user);
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
}
  
async function deleteUnusedTags() {
    try {
      const allTags = await Tag.find({});
      for (const tag of allTags) {
        const tagUsageCount = await Question.countDocuments({ tags: tag._id });
        if (tagUsageCount === 0) {
          await Tag.findByIdAndDelete(tag._id);
        //   //console.log(`Tag "${tag.name}" deleted.`);
        }
      }  
    //   //console.log('Unused tags deletion completed.');
    } catch (error) {
      console.error('Error deleting unused tags:', error);
    }
  }

//   async function deleteUnusedAnswer() {
//     try {
//       const allAnswers = await Answer.find({});
//       for (const answer of allAnswers) {
//         const tagUsageCount = await Question.countDocuments({ answers: answer._id });
//         if (tagUsageCount === 0) {
//           await Answer.findByIdAndDelete(tag._id);
//         //   //console.log(`Tag "${tag.name}" deleted.`);
//         }
//       }  
//     //   //console.log('Unused tags deletion completed.');
//     } catch (error) {
//       console.error('Error deleting unused tags:', error);
//     }
//   }

module.exports = {
    deleteSessiononUser,
    findUserForAdmin,
    deleteUser,
    findSession,
    deleteAnswer,
    updateAnswer,
    commentUpvoteQ,
    commentUpvote,
    addCommentToQuestion,
    addCommentToAnswer,
    AnswerDownVote,
    AnswerUpvote,
    QuestionUpvote,
    QuestionDownvote,
    getAllQuestions,
    getQuestionById,
    loginAttempt,
    generateSession,
    addAnswerToQuestion,
    getUnansweredQuestions,
    getActiveQuestions,
    createQuestion,
    formatDateTime,
    getAllTags,
    newQuestionTagCheck,
    addAnswer,
    getQuestionsByTag,
    newRegister,
    searchData,
    updateUserReputationByUsername,
    getQuestionByIdUpdate,
    getQuestionByUser,
    deleteQuestion,
    updateQuestion,
    getAllUsers,
    // getUserData,
    getAnsweredQuestionsByUser,
    getAnswerTextById,
    getTagsByUser,
    deleteUserTags,
    updateUserTags,
};