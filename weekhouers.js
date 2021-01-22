
window.onload = function () {
   let selectAll = document.querySelector('.select__all');
   let resetAll = document.querySelector('.select__reset');
   let total = document.querySelector('.total__quantity');
   let percent = document.querySelector('.total__persent');
   let classSign = document.getElementsByClassName('sign');
   let elementsCheckboxHours = document.querySelectorAll('.hours__check input');
   let elementsCheckboxDays = document.querySelectorAll('.days__check input');
   let sendButton = document.querySelector('.submit');
   let showResponse = document.querySelector('.response');
   let saveTimetable = []; // Тут будем хранить сохраненные данные пользователем (многомерный массив)
   let activeCells = []; // Тут будем хранить все ячейки сохраненные пользователем (массив)
   let elementOpenSave = document.getElementById('open');
   let buttonApplyAndDeleteId = 0; // счетчик для ID значений кнопок DELETE и APPLY

   for (let i = 0; i < classSign.length; i++) {
      classSign[i].setAttribute('data-id', i + 1);
      classSign[i].setAttribute('data-color', 'none');
      if (i < 24) {
         classSign[i].setAttribute('data-save', `{ "monday": { "${i}": "false" }, "id": "${i + 1}" }`);
      }
      else if (i > 23 && i < 48) {
         classSign[i].setAttribute('data-save', `{ "tuesday": { "${i - 24}": "false" }, "id": "${i + 1}"  }`);
      }
      else if (i > 47 && i < 72) {
         classSign[i].setAttribute('data-save', `{ "wednesday": { "${i - 48}": "false" }, "id": "${i + 1}"  }`);
      }
      else if (i > 71 && i < 96) {
         classSign[i].setAttribute('data-save', `{ "thursday": { "${i - 72}": "false" }, "id": "${i + 1}"  }`);
      }
      else if (i > 95 && i < 120) {
         classSign[i].setAttribute('data-save', `{ "friday": { "${i - 96}": "false" }, "id": "${i + 1}"  }`);
      }
      else if (i > 119 && i < 144) {
         classSign[i].setAttribute('data-save', `{ "saturday": { "${i - 120}": "false" }, "id": "${i + 1}"  }`);
      }
      else if (i > 143 && i < 168) {
         classSign[i].setAttribute('data-save', `{ "sunday": { "${i - 144}": "false" }, "id": "${i + 1}"  }`);
      }
      /*Ставим прослушку клика на ячейке*/
      classSign[i].addEventListener('click', function () {
         let currentId = classSign[i].dataset.id;
         changeSignAndColculateTotal(currentId);
      });
   }

   /*Ставим прослушку клика на  selectAll*/
   selectAll.addEventListener('click', function () {
      for (let i = 0; i < classSign.length; i++) {
         if (classSign[i].innerHTML == '+') continue;
         let currentId = classSign[i].dataset.id;
         changeSignAndColculateTotal(currentId);
      }
   });

   /*Ставим прослушку клика на  resetAll*/
   resetAll.addEventListener('click', function () {
      for (let i = 0; i < classSign.length; i++) {
         if (classSign[i].innerHTML == '-') continue;
         let currentId = classSign[i].dataset.id;
         changeSignAndColculateTotal(currentId);
      }
   });
   /*-----------------------CHECKBOX HOURS------------------- */
   for (let i = 0; i < elementsCheckboxHours.length; i++) {
      elementsCheckboxHours[i].addEventListener('click', function () {
         let startId = elementsCheckboxHours[i].getAttribute('id');
         let k = +startId;
         if (this.checked) {
            for (k; k <= classSign.length; k += 24) {
               if (classSign[k - 1].innerHTML == '+') continue;
               changeSignAndColculateTotal(k);
            }
         } else {
            for (k; k <= classSign.length; k += 24) {
               if (classSign[k - 1].innerHTML == '-') continue;
               changeSignAndColculateTotal(k);
            }
         }
      });
   }

   /*-----------------------CHECKBOX DAYS------------------- */
   for (let i = 0; i < elementsCheckboxDays.length; i++) {
      elementsCheckboxDays[i].addEventListener('click', function () {
         let stopId = +elementsCheckboxDays[i].getAttribute('id');
         let startId = stopId - 24;
         if (this.checked) {
            for (startId; startId < (classSign.length - classSign.length + stopId); startId++) {
               if (classSign[startId - 1].innerHTML == '+') continue;
               changeSignAndColculateTotal(startId);
            }
         } else {
            for (startId; startId < (classSign.length - classSign.length + stopId); startId++) {
               if (classSign[startId - 1].innerHTML == '-') continue;
               changeSignAndColculateTotal(startId);
            }
         }
      });
   }

   function checkForRepetCell(repeatCells) {
      repeatCells.forEach((item, index) => {
         let check = item; // сохряняем проверяемый элемент
         let saveIndex = index
         repeatCells.splice(index, 1);
         repeatCells.forEach((item) => {
            if (item == check) {
               let currentBlock = document.querySelector(`[data-save='${item}']`);
               if (currentBlock !== null) {
                  currentBlock.dataset.color = 'red';
               }
            }
         })
         repeatCells.splice(saveIndex, 0, check);
      });
   }

   function selectActiveCell(activeCells) {
      activeCells.length = 0;
      for (i = 0; i < saveTimetable.length; i++) {
         saveTimetable[i].forEach((item, index) => {
            if (item.includes("true")) {
               activeCells.push(saveTimetable[i][index]);
            }
         });
      }
   }

   function changeSignAndColculateTotal(currentId) {
      let currentBlock = document.querySelector(`[data-id='${currentId}']`);
      let hourStatusSave = currentBlock.dataset.save;
      if (currentBlock.innerHTML == '-') {
         currentBlock.innerHTML = '+';
         currentBlock.dataset.color = 'green';
         hourStatusSave = hourStatusSave.replace('false', 'true')
         currentBlock.dataset.save = hourStatusSave;
         total.innerHTML = +total.innerHTML + 1;
         percent.innerHTML = '(' + Math.round(total.innerHTML * 100 / 168) + '%)';
         checkHorizontalField(currentId);
         checkedVerticalField(currentId);
         if (saveTimetable.length > 1) {
            selectActiveCell(activeCells); // выбираем все активные ячейки из сохраненных
            checkForRepetCell(activeCells); // проверяем на совбадения
         }
      } else {
         currentBlock.innerHTML = '-';
         currentBlock.dataset.color = 'none';
         hourStatusSave = hourStatusSave.replace('true', 'false')
         currentBlock.dataset.save = hourStatusSave;
         total.innerHTML = +total.innerHTML - 1;
         percent.innerHTML = '(' + Math.round(total.innerHTML * 100 / 168) + '%)';
         checkHorizontalField(currentId);
         checkedVerticalField(currentId);
      }
   }

   function checkHorizontalField(currentId) {
      /*Определяем начальную и конечную ячейку в строке*/
      let startCell = 0;
      let stopCell = 0;
      for (let i = currentId; i > 0; i -= 24) {
         startCell = i;
      }
      startCell = currentId - startCell + 1;
      stopCell = startCell + 23;

      /*Проверяем все ли ячейки заполнены в строке*/
      let isNotAllBlocksPlus = false;
      for (let cell = startCell; cell <= stopCell; cell++) {
         let currentBlock = document.querySelector(`[data-id='${cell}']`)
         if (currentBlock.innerHTML == '+') {
            isNotAllBlocksPlus += false;
         } else {
            isNotAllBlocksPlus += true;
         }
      }
      /*Активируе(дезактивируем) checkbox в строке*/
      let currentCheckbox = document.getElementById(`${stopCell + 1}`);
      if (isNotAllBlocksPlus == false) {
         currentCheckbox.checked = true;
      } else {
         currentCheckbox.checked = false;
      }
   }

   function checkedVerticalField(currentId) {
      /*Определяем начальную и конечную ячейку в строке*/
      let startCell = 0;
      let stopCell = 0;
      for (let i = currentId; i > 0; i -= 24) {
         startCell = i;
      }
      for (let i = +startCell; i <= 168; i += 24) {
         stopCell = i;
      }

      /*Проверяем все ли ячейки заполнены в строке*/
      let isNotAllBlocksPlus = false;
      for (let cell = +startCell; cell <= stopCell; cell += 24) {
         let currentBlock = document.querySelector(`[data-id='${cell}']`)
         if (currentBlock.innerHTML == '+') {
            isNotAllBlocksPlus += false;
         } else {
            isNotAllBlocksPlus += true;
         }
      }

      /*Активируе(дезактивируем) checkbox в строке*/
      let currentCheckbox = document.getElementById(`${+startCell}`);
      if (isNotAllBlocksPlus == false) {
         currentCheckbox.checked = true;
      } else {
         currentCheckbox.checked = false;
      }
   }

   sendButton.addEventListener('click', function () {
      let saveData = document.querySelectorAll('[data-save]');
      showResponse.innerHTML = ''; // Вывод парсинга JSON на страницу
      let jsonValue = ''; // сборка в строку JSON объекта из атрибутов data-save
      for (let i = 0; i < saveData.length; i++) {
         jsonValue += saveData[i].dataset.save + ';'; // разделяем каждый JSON объект в строке
         /* Вывод парсинга JSON на страницу*/
         let showJson = saveData[i].dataset.save;
         let data = JSON.parse(showJson);
         let span = '<span>'
         if (i < 24) {
            span = (data.monday[i] == 'false') ? '<span>' : '<span class=\'green\'>'
            showResponse.innerHTML += (i == 0) ? '<b>Monday:</b><br>' + '\t' + i + ': ' + `${span}` + data.monday[i] + '</span><br>' : '\t' + i + ': ' + `${span}` + data.monday[i] + '</span><br>';
         } else if (i > 23 && i < 48) {
            span = (data.tuesday[i - 24] == 'false') ? '<span>' : '<span class=\'green\'>'
            showResponse.innerHTML += (i == 24) ? '<b>Tuesday:</b><br>' + '\t' + (i - 24) + ': ' + `${span}` + data.tuesday[i - 24] + '</span><br>' : '\t' + (i - 24) + ': ' + `${span}` + data.tuesday[i - 24] + '</span><br>';
         } else if (i > 47 && i < 72) {
            span = (data.wednesday[i - 48] == 'false') ? '<span>' : '<span class=\'green\'>'
            showResponse.innerHTML += (i == 48) ? '<b>Wednesday:</b><br>' + '\t' + (i - 48) + ': ' + `${span}` + data.wednesday[i - 48] + '</span><br>' : '\t' + (i - 48) + ': ' + `${span}` + data.wednesday[i - 48] + '</span><br>';
         } else if (i > 71 && i < 96) {
            span = (data.thursday[i - 72] == 'false') ? '<span>' : '<span class=\'green\'>'
            showResponse.innerHTML += (i == 72) ? '<b>Thursday:</b><br>' + '\t' + (i - 72) + ': ' + `${span}` + data.thursday[i - 72] + '</span><br>' : '\t' + (i - 72) + ': ' + `${span}` + data.thursday[i - 72] + '</span><br>';
         } else if (i > 95 && i < 120) {
            span = (data.friday[i - 96] == 'false') ? '<span>' : '<span class=\'green\'>'
            showResponse.innerHTML += (i == 96) ? '<b>Friday:</b><br>' + '\t' + (i - 96) + ': ' + `${span}` + data.friday[i - 96] + '</span><br>' : '\t' + (i - 96) + ': ' + `${span}` + data.friday[i - 96] + '</span><br>';
         } else if (i > 119 && i < 144) {
            span = (data.saturday[i - 120] == 'false') ? '<span>' : '<span class=\'green\'>'
            showResponse.innerHTML += (i == 120) ? '<b>Saturday:</b><br>' + '\t' + (i - 120) + ': ' + `${span}` + data.saturday[i - 120] + '</span><br>' : '\t' + (i - 120) + ': ' + `${span}` + data.saturday[i - 120] + '</span><br>';
         } else if (i > 143 && i < 168) {
            span = (data.sunday[i - 144] == 'false') ? '<span>' : '<span class=\'green\'>'
            showResponse.innerHTML += (i == 144) ? '<b>Sunday:</b><br>' + '\t' + (i - 144) + ': ' + `${span}` + data.sunday[i - 144] + '</span><br>' : '\t' + (i - 144) + ': ' + `${span}` + data.sunday[i - 144] + '</span><br>';
         }
         /* Вывод парсинга JSON на страницу*/
      }

      let saveJson = jsonValue.split(';'); // создаем массив из объектов используя разделитель
      saveTimetable.push(saveJson); // вставляем в массив массив из объектов

      selectActiveCell(activeCells); // выбираем все активные ячейки из сохраненных
      checkForRepetCell(activeCells); // проверяем на совбадения

      let saveName = document.getElementById('text-field').value;
      saveName = (saveName == '') ? 'APPLY' : saveName;
      document.getElementById('text-field').value = '';
      //создаем блок с кнопками
      elementOpenSave.innerHTML += `<div class="open-item"><input data-apply-id="${buttonApplyAndDeleteId}" class="apply" type="button" value="${saveName}"><input data-delete-id="${buttonApplyAndDeleteId}" class="delete" type="button" value="delete"></div>`;
      buttonApplyAndDeleteId++; // счетчик для ID значений кнопок
      let buttonApply = document.querySelectorAll('[data-apply-id]');
      let buttonDelete = document.querySelectorAll('[data-delete-id]');

      /*кнопка DELETE*/
      for (let i = 0; i < buttonDelete.length; i++) {
         buttonDelete[i].addEventListener('click', function () {
            buttonApplyAndDeleteId--;
            this.parentNode.parentNode.removeChild(this.parentNode); // удаляем блок
            /* УДАЛЯЕМ ЛИШНИЕ ДАННЫЕ (ИЗ МАССИВА И АТРИБУТОВ) */
            buttonApply = document.querySelectorAll('[data-apply-id]'); // обновляем buttonApply.length
            buttonDelete = document.querySelectorAll('[data-delete-id]'); // обновляем buttonDelete.length
            saveTimetable.splice(this.dataset.deleteId, 1); // удаляем массив с позиции deleteId, 1 элемент.
            for (let k = this.dataset.deleteId; k < buttonApply.length; k++) {
               buttonApply[k].dataset.applyId = k; // устанавливаем новые значения data-apply-id
               buttonDelete[k].dataset.deleteId = k;// устанавливаем новые значения data-delete-id
            }
            buttonApply = document.querySelectorAll('[data-apply-id]');
         });
      }

      /*кнопка APPLY*/
      for (let i = 0; i < buttonApply.length; i++) {
         buttonApply[i].addEventListener('click', function () {
            let jsonId = this.dataset.applyId // Получаем ID кнопки
            for (let i = 0; i < saveJson.length - 1; i++) { // saveJson это массив сохраненый пользователем 
               if (saveTimetable[jsonId][i] == classSign[i].dataset.save) continue; // берем конкретное сохранение и провереяем текущие состояние ячейки на соответствие сохранению
               let currentId = classSign[i].dataset.id;
               changeSignAndColculateTotal(currentId);
            }
            selectActiveCell(activeCells);
            checkForRepetCell(activeCells);
         });
      }
   });
}