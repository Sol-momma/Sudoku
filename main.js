// ファイルの先頭に追加
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    // テーマの設定を保存
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// ページ読み込み時に保存されたテーマを適用
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // テーマトグルボタンのイベントリスナーを設定
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
});

// 問題
let question = [
  [8, 7, 1, 0, 0, 0, 5, 6, 4],
  [0, 9, 5, 0, 1, 7, 2, 3, 8],
  [2, 0, 3, 4, 5, 8, 0, 7, 1],
  [0, 2, 0, 1, 0, 3, 7, 9, 5],
  [0, 1, 9, 2, 7, 0, 8, 4, 3],
  [7, 0, 4, 0, 8, 5, 0, 0, 2],
  [1, 5, 0, 0, 0, 4, 3, 8, 0],
  [0, 8, 7, 5, 0, 0, 0, 0, 6],
  [0, 0, 0, 0, 3, 2, 1, 0, 7],
];

// クリックされた要素を保持
let place;

// (Han-Yu) timer variables
let timer;
let seconds = 0;
// (by Han-Yu)

init();
// ゲーム面���成
function init() {
  const main = document.querySelector(".main");
  const select = document.querySelector(".select");

  // (Han-Yu) 清空現有內容
  main.innerHTML = "";
  select.innerHTML = "";
  // (by Han-Yu)

  // (Han-Yu) Start the timer
  startTimer();
  // (by Han-Yu)
  
  for (let i = 0; i < 9; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < 9; j++) {
      let td = document.createElement("td");
      td.onclick = mainClick;
      tr.appendChild(td);
      if (question[i][j] != 0) {
        td.textContent = question[i][j];
        td.classList.add("clickdisable");
      } else {
        td.textContent = null;
        td.classList.add("clickenable");
      }
    }
    main.appendChild(tr);
  }

  for (let i = 0; i < 9; i++) {
    let td = document.createElement("td");
    td.onclick = selectClick;
    td.value = i + 1;
    select.appendChild(td);
    td.textContent = i + 1;
  }
}

// 問題パネルのマスが押された時の処理
function mainClick(e) { 
    // 以前の選択を解除
  if (place != undefined) {
    place.classList.remove("mainClick");
    const previousRow = place.parentElement;
    const previousColIndex = Array.from(previousRow.children).indexOf(place);
    
    // 行と列のハイライトを解除
    previousRow.querySelectorAll("td").forEach(td => td.classList.remove("highlight"));
    const allRows = document.querySelectorAll(".main tr");
    allRows.forEach(row => {
        row.children[previousColIndex].classList.remove("highlight");
    });
  }

  place = e.target;
  place.classList.add("mainClick");

    // 行と列をハイライト
    const currentRow = place.parentElement;
    const currentColIndex = Array.from(currentRow.children).indexOf(place);
    
    currentRow.querySelectorAll("td").forEach(td => td.classList.add("highlight"));
    const allRows = document.querySelectorAll(".main tr");
    allRows.forEach(row => {
        row.children[currentColIndex].classList.add("highlight");
    });
}

// 数字選択のマスが押された時の処理
function selectClick(e) {
  place.textContent = e.target.value;
  const selectedNumber = e.target.value;
    place.textContent = selectedNumber;

    // すべてのセルをリセット
    const allCells = document.querySelectorAll(".main td");
    allCells.forEach(cell => {
        cell.classList.remove("highlight");
    });

    // 同じ数字を持つセルをハイライト
    allCells.forEach(cell => {
        if (cell.textContent === selectedNumber) {
            cell.classList.add("highlight");
        }
    });
}

// 正解判定
function check() {
  const h2 = document.querySelector("h2");
  const tr = document.querySelectorAll(".main tr");
  let checkFlag = true;
  // 横計算
  for (let i = 0; i < 9; i++) {
    let sum = 0;
    let td = tr[i].querySelectorAll("td");
    for (let j = 0; j < 9; j++) {
      sum += Number(td[j].textContent);
    }
    if (sum != 45) {
      checkFlag = false;
      break;
    }
  }
  // 縦計算
  for (let i = 0; i < 9; i++) {
    let sum = 0;
    for (let j = 0; j < 9; j++) {
      let td = tr[j].querySelectorAll("td");
      sum += Number(td[i].textContent);
    }
    if (sum != 45) {
      checkFlag = false;
      break;
    }
  }
  if (checkFlag) {
    h2.textContent = "Ding ding ding! Correct!";
    // (Han-Yu) Stop the timer
    stopTimer();
    // (by Han-Yu)
  } else {
    h2.textContent = "Nope that's wrong!";
  }
}

//消す処理
function remove() {
  place.textContent = null;
}

// リセット機能を追加
function resetGame() {
    // メインテーブルの全セルを初期状態に戻す
    const mainTable = document.querySelector(".main");
    const cells = mainTable.querySelectorAll("td");
    cells.forEach(cell => {
        if (!cell.classList.contains("clickdisable")) {
            cell.textContent = "";
        }
    });

    // (Han-Yu) Reset the timer
    resetTimer();
    init();
    // (by Han-Yu)
    
    // 選択されたセルをリセット
    if (place) {
        place.classList.remove("mainClick");
        place = undefined;
    }
    
    // 結果メッセージをクリア
    const h2 = document.querySelector("h2");
    h2.textContent = "";
}

// 数独パズル生成のためのユーティリティ関数
function invalidNumbers(sudoku, x, y) {
    const size = sudoku.length;
    const block = Math.sqrt(size);
    const bx = x - (x % block);
    const by = y - (y % block);

    const invalid = new Set();

    // 同じ行の数値
    for (let i = 0; i < size; i++) {
        invalid.add(sudoku[y][i]);
    }

    // 同じ列の数値
    for (let i = 0; i < size; i++) {
        invalid.add(sudoku[i][x]);
    }

    // ブロック内の数値
    for (let i = by; i < by + block; i++) {
        for (let j = bx; j < bx + block; j++) {
            invalid.add(sudoku[i][j]);
        }
    }

    return invalid;
}

function validNumbers(sudoku, x, y) {
    const size = sudoku.length;
    const allNumbers = new Set(Array.from({ length: size }, (_, i) => i + 1));
    const invalid = invalidNumbers(sudoku, x, y);
    return new Set([...allNumbers].filter(num => !invalid.has(num)));
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 新しい数独パズルを生成する関数
function generateNewPuzzle() {
    const size = 9;
    const puzzle = Array(size).fill().map(() => Array(size).fill(0));
    
    // 最初の行をランダムに生成
    puzzle[0] = shuffle(Array.from({ length: size }, (_, i) => i + 1));
    
    // バックトラッキングで残りを埋める
    if (solveSudoku(puzzle)) {
        // ランダムにいくつかのマスを空白にする
        const difficulty = 40; // 空白マスの数（調整可能）
        let count = 0;
        while (count < difficulty) {
            const x = Math.floor(Math.random() * size);
            const y = Math.floor(Math.random() * size);
            if (puzzle[y][x] !== 0) {
                puzzle[y][x] = 0;
                count++;
            }
        }
        return puzzle;
    }
    return null;
}

function solveSudoku(puzzle) {
    const size = puzzle.length;
    let row = -1;
    let col = -1;
    let isEmpty = false;
    
    // 空のマスを探す
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (puzzle[i][j] === 0) {
                row = i;
                col = j;
                isEmpty = true;
                break;
            }
        }
        if (isEmpty) break;
    }
    
    // すべてのマスが埋まっていれば完了
    if (!isEmpty) return true;
    
    // 使用可能な数字を試す
    const valid = Array.from(validNumbers(puzzle, col, row));
    shuffle(valid); // ランダム性を追加
    
    for (const num of valid) {
        puzzle[row][col] = num;
        if (solveSudoku(puzzle)) {
            return true;
        }
        puzzle[row][col] = 0;
    }
    
    return false;
}

// 新しいパズル生成ボタンのイベントハンドラ
function newPuzzle() {
    const newQuestion = generateNewPuzzle();
    if (newQuestion) {
        // グローバルの問題配列を更新
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                question[i][j] = newQuestion[i][j];
            }
        }

        // (Han-Yu) Reset Timer
        resetTimer();
        // (by Han-Yu)
        
        // 既存の盤面をクリア
        const main = document.querySelector(".main");
        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }
        
        // 数字選択パネルをクリア
        const select = document.querySelector(".select");
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
        
        // 選択状態をリセット
        if (place) {
            place.classList.remove("mainClick");
            place = undefined;
        }

        // 新しい盤面を生成
        init();
        
        // 結果メッセージをクリア
        const h2 = document.querySelector("h2");
        h2.textContent = "";
    }
}

// (Han-Yu) add the timer function

function startTimer() {
  const timerDisplay = document.getElementById('timer');
  seconds = 0;
  if (timer) clearInterval(timer);

  timer = setInterval(function () {
    seconds++;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(secs).padStart(2, '0');

    timerDisplay.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function resetTimer() {
  stopTimer();
  seconds = 0;
  document.getElementById('timer').textContent = "00:00:00";
}
// (by Han-Yu)