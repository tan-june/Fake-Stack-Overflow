import axios from 'axios';

export const createQuestionElement = (questions, buttonClick) => {
  const questionDetailsContainer = document.getElementById('questionDetails');
  questionDetailsContainer.innerHTML = '';

  questions.forEach(question => {
      const questionElement = `
          <div class="question-container">
              <div class="question-container-left">
                  ${question.answers.length} Answer(s) <br>
                  ${question.views} Views <br>
                  ${question.questionrep} Votes <br>
              </div>
              <div class="question-container-center">
                  <h3>
                      <a href="#" id="questionLink">
                          ${question.title}
                          </a>

                          <br />                                                
                  </h3>
                  <div>
                  <div style={{ fontSize: '10px', fontWeight: 'normal' }}>${question.qsummary}</div>
                </div>

                  <br>
                  <div class="tagContainer" id="tagContainer"></div>
              </div>
              <div class="question-container-right">
                  <div style="color: red;">${question.asked_by} </div>asked ${(question.ask_date_time)}<br>
              </div>
          </div>
      `;

      const divElement = document.createElement('div');
      divElement.innerHTML = questionElement;

      questionDetailsContainer.appendChild(divElement);

      // Select the tagContainer for this specific question
      const tagContainer = divElement.querySelector('#tagContainer');

      question.tags.forEach(tag => {
          const tagElement = document.createElement('div');
          tagElement.classList.add('taginQ');
          tagElement.innerHTML = `<div class='inner-tag'>${tag.name ?? ''}</div>`;
          tagContainer.appendChild(tagElement);
      });
      const questionLink = divElement.querySelector('#questionLink');
      questionLink.addEventListener('click', () => {
          //console.log(question._id);
          buttonClick(question._id);
      });
  });
};
 
  export const newestLoad = async () => {
    return axios
      .get('http://localhost:8000/getAllQuestionsAndCount')
      .then((res) => {
        const reversedQuestions = res.data.questions.reverse();
        return {
          questionCount: res.data.questionCount,
          questionsArray: reversedQuestions,
          currentPage: 1,
        };
      })
      .catch((error) => {
        console.error('Error retrieving questions and question count:', error);
      });
  };
  
  export const activeMode = async () => {
    return axios
      .get('http://localhost:8000/getActiveQuestionsAndCount')
      .then((res) => {
        const reversedQuestions = res.data.questions;
        return {
          questionCount: reversedQuestions.length,
          questionsArray: reversedQuestions,
          currentPage: 1,
        };
      })
      .catch((error) => {
        console.error('Error retrieving questions and question count:', error);
      });
  };
  
  export const getUnanswered = async () => {
    return axios
      .get('http://localhost:8000/getUnansweredQuestionsAndCount')
      .then((res) => {
        const reversedQuestions = res.data.questions.reverse();
        return {
          questionCount: reversedQuestions.length,
          questionsArray: reversedQuestions,
          currentPage: 1,
        };
      })
      .catch((error) => {
        console.error('Error retrieving questions and question count:', error);
      });
  };

  export const checkUser = async () => {
    return axios
      .get("http://localhost:8000/CheckSession", { withCredentials: true })
      .then((response) => {
        return response.data.validated;
      })
      .catch((error) => {
        console.error("Error checking user session:", error);
        return false;
      });
  };
  