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
