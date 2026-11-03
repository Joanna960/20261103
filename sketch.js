// 儲存玩家與機器對手的戰鬥狀態。
let playerHealth = 100; // 主角目前的生命值。
let enemyHealth = 100; // 機器對手目前的生命值。
let score = 0; // 記錄答對題目獲得的分數。
let combo = 0; // 記錄連續答對的題數。
let questionIndex = 0; // 記錄目前題庫進度。
let selectedAnswer = -1; // 記錄玩家選擇的答案編號。
let answerLocked = false; // 作答後暫時鎖定輸入，顯示回饋動畫。
let feedbackUntil = 0; // 記錄回饋動畫結束的時間。
let gameResult = "playing"; // 保存遊戲狀態：進行中、勝利或失敗。
let hitFlash = 0; // 控制受擊時的短暫畫面閃光。
let playerDownUntil = 0; // 記錄主角倒地動畫結束的時間。
let robotAttackUntil = 0; // 記錄機器人出拳動畫結束的時間。

// 建立適合國中程度的歷史四選一題庫。
const questions = [
  { question: "秦始皇統一六國後，採用哪一種文字作為標準？", choices: ["甲骨文", "小篆", "楷書", "隸書"], answer: 1, explanation: "秦始皇推行「書同文」，以小篆作為全國通行的標準文字。" },
  { question: "漢代開通、促進東西交流的重要路線是？", choices: ["茶馬古道", "絲綢之路", "大運河", "鄭和航線"], answer: 1, explanation: "張騫出使西域後，漢朝與西域往來增加，絲綢之路成為東西交流的重要路線。" },
  { question: "唐朝時，前往日本傳授佛法的高僧是誰？", choices: ["玄奘", "鑑真", "法顯", "鳩摩羅什"], answer: 1, explanation: "鑑真和尚多次嘗試東渡日本，成功後傳授佛法並協助建立寺院。" },
  { question: "宋代重要的海上貿易港口之一是？", choices: ["泉州", "北京", "西安", "洛陽"], answer: 0, explanation: "泉州位於東南沿海，宋元時期港口貿易興盛，是重要的海上交通中心。" },
  { question: "明朝時率領船隊下西洋的是哪一位人物？", choices: ["戚繼光", "鄭成功", "鄭和", "張騫"], answer: 2, explanation: "鄭和奉明成祖之命多次率領大型船隊遠航，前往東南亞、印度洋等地。" },
  { question: "清朝末年，臺灣在哪一年建省？", choices: ["1683 年", "1885 年", "1895 年", "1945 年"], answer: 1, explanation: "清廷在 1885 年正式設立臺灣省，首任巡撫是劉銘傳。" },
  { question: "臺灣原住民族中，曾與荷蘭人締結條約的族群是？", choices: ["凱達格蘭族", "西拉雅族", "排灣族", "泰雅族"], answer: 1, explanation: "西拉雅族是臺灣西南部的平埔族群，曾與荷蘭人接觸並締結協議。" },
  { question: "第二次世界大戰結束於哪一年？", choices: ["1918 年", "1939 年", "1945 年", "1949 年"], answer: 2, explanation: "德國於 1945 年 5 月投降，日本於同年 9 月正式簽署降書，第二次世界大戰結束。" },
  { question: "臺灣民主國成立於哪一年？", choices: ["1895 年", "1911 年", "1921 年", "1949 年"], answer: 0, explanation: "清朝在 1895 年簽訂《馬關條約》割讓臺灣，臺灣民主國隨後成立以抵抗日軍接收。" },
  { question: "清代渡臺禁令逐漸解除後，哪個家族在臺灣開墾有名？", choices: ["鄭氏家族", "霧峰林家", "板橋林家", "新竹陳家"], answer: 2, explanation: "板橋林家在清代於北臺灣拓墾並累積土地，是臺灣著名的家族之一。" },
  { question: "商朝常用哪一種文字占卜並記錄事情？", choices: ["甲骨文", "小篆", "金文", "楷書"], answer: 0, explanation: "商人把占卜結果刻在龜甲或獸骨上，這些文字稱為甲骨文，是目前重要的早期漢字資料。" },
  { question: "春秋時期提出「有教無類」主張的思想家是誰？", choices: ["老子", "孔子", "墨子", "韓非子"], answer: 1, explanation: "孔子主張教育不應受身分或出身限制，這個理念稱為「有教無類」。" },
  { question: "秦朝中央政府中，負責監察百官的官職是？", choices: ["丞相", "太尉", "御史大夫", "郡守"], answer: 2, explanation: "秦朝中央設御史大夫負責監察；丞相掌行政，太尉掌軍事，郡守則治理郡。" },
  { question: "傳統上被認為改進造紙術的東漢人物是誰？", choices: ["張衡", "蔡倫", "司馬遷", "班超"], answer: 1, explanation: "東漢蔡倫改進造紙方法，利用樹皮、麻頭等材料製紙，促進文字記錄與傳播。" },
  { question: "隋朝為了連接南北交通而開鑿的重要工程是？", choices: ["靈渠", "都江堰", "大運河", "鄭國渠"], answer: 2, explanation: "隋朝大運河連接南北水系，方便交通、漕運與各地往來。" },
  { question: "唐朝首都長安位於今天的哪一座城市附近？", choices: ["西安", "南京", "杭州", "成都"], answer: 0, explanation: "唐朝長安城位於今天陝西省西安市一帶，是當時重要的政治與國際交流中心。" },
  { question: "宋代指南針廣泛應用於哪一種活動？", choices: ["海上航行", "活字印刷", "水利灌溉", "科舉考試"], answer: 0, explanation: "指南針能辨別方向，宋代應用於海上航行，讓船隻較容易掌握航向。" },
  { question: "活字印刷術的發明者畢昇生活在哪個朝代？", choices: ["漢朝", "唐朝", "宋朝", "明朝"], answer: 2, explanation: "北宋的畢昇發明泥活字印刷，比逐字雕刻整版更方便重複排版。" },
  { question: "元朝的建立者忽必烈屬於哪一個族群？", choices: ["女真族", "蒙古族", "滿族", "契丹族"], answer: 1, explanation: "忽必烈是蒙古帝國的領袖，建立元朝並統一中國。" },
  { question: "明代鄭和船隊下西洋時，明朝的皇帝是？", choices: ["明太祖", "明成祖", "明英宗", "明神宗"], answer: 1, explanation: "鄭和受明成祖朱棣派遣下西洋，第一次航行於 1405 年出發。" },
  { question: "鄭成功於 1662 年從哪一國手中收復臺灣？", choices: ["西班牙", "荷蘭", "英國", "葡萄牙"], answer: 1, explanation: "鄭成功率軍攻打荷蘭東印度公司在臺據點，荷蘭守軍於 1662 年投降。" },
  { question: "清朝何時開始將臺灣納入版圖並設府治理？", choices: ["1684 年", "1885 年", "1895 年", "1945 年"], answer: 0, explanation: "清廷於 1683 年擊敗鄭氏政權，隔年設臺灣府，將臺灣納入行政治理。" },
  { question: "清朝在甲午戰爭後，透過哪一項條約將臺灣割讓給日本？", choices: ["南京條約", "馬關條約", "北京條約", "辛丑條約"], answer: 1, explanation: "清朝在 1895 年簽訂《馬關條約》，將臺灣及澎湖割讓給日本。" },
  { question: "辛亥革命發生於哪一年？", choices: ["1895 年", "1905 年", "1911 年", "1919 年"], answer: 2, explanation: "武昌起義於 1911 年爆發，推動辛亥革命，最終促成清朝結束統治。" },
  { question: "五四運動發生於哪一年？", choices: ["1911 年", "1919 年", "1927 年", "1937 年"], answer: 1, explanation: "1919 年巴黎和會的山東問題引發學生上街抗議，五四運動隨之展開。" },
  { question: "第二次世界大戰期間，臺灣結束日本統治是在？", choices: ["1911 年", "1937 年", "1945 年", "1949 年"], answer: 2, explanation: "日本在 1945 年戰敗投降，依戰後安排，臺灣結束日本統治。" },
  { question: "中華人民共和國成立於哪一年？", choices: ["1912 年", "1937 年", "1945 年", "1949 年"], answer: 3, explanation: "1949 年 10 月 1 日，中華人民共和國在北京宣告成立。" },
  { question: "荷蘭東印度公司在臺灣建立據點，主要位於哪個地區？", choices: ["臺灣北部", "臺灣西南部", "臺灣東部", "澎湖以北"], answer: 1, explanation: "荷蘭東印度公司主要在臺灣西南部建立據點，曾以大員（今臺南安平一帶）為中心。" }
];

// 設定滿版畫布與全域繪圖文字樣式。
function setup() {
  createCanvas(windowWidth, windowHeight); // 讓畫布一開始就填滿瀏覽器視窗。
  shuffleQuestions(); // 每次載入遊戲時重新排列題目。
  textFont("sans-serif"); // 使用跨裝置可讀的中文字型。
  textAlign(CENTER, CENTER); // 讓遊戲文字以中心點對齊。
  rectMode(CORNER); // 使用左上角作為矩形座標。
}

// 依照目前視窗尺寸重新安排畫布。
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 視窗或裝置方向改變時同步畫布大小。
}

// 每一影格重新繪製場景、角色與遊戲介面。
function draw() {
  drawBackdrop(); // 繪製帶有格線與光暈的競技場背景。
  drawHeader(); // 顯示遊戲名稱、分數與連擊數。
  drawBattlefield(); // 顯示兩名角色與雙方生命值。
  drawQuestionPanel(); // 顯示題目、答案選項與作答回饋。
  drawResultOverlay(); // 遊戲結束時顯示勝負與重新開始按鈕。
}

// 繪製深色競技場與細緻的網格背景。
function drawBackdrop() {
  background("#212529"); // 使用指定的深灰色作為整體背景。
  noStroke(); // 背景裝飾不顯示外框。
  for (let y = 0; y < height; y += 4) { // 以細橫帶製作柔和的垂直色差。
    fill(22, 33 + y * 0.015, 37 + y * 0.018, 55); // 讓畫面下方稍微明亮。
    rect(0, y, width, 4); // 畫出目前這一道背景色帶。
  }
  stroke(255, 255, 255, 12); // 設定低對比度的格線顏色。
  strokeWeight(1); // 使用細線，避免格線干擾文字。
  for (let x = 0; x < width; x += 48) line(x, 0, x, height); // 畫出垂直格線。
  for (let y = 0; y < height; y += 48) line(0, y, width, y); // 畫出水平格線。
  noStroke(); // 後續圖形恢復為無外框模式。
  fill(65, 217, 184, 20); // 使用青綠色點綴舞台中央。
  ellipse(width * 0.24, height * 0.36, min(width, height) * 0.48); // 加上主角側柔光。
  fill(255, 113, 87, 19); // 使用珊瑚紅點綴對手區域。
  ellipse(width * 0.76, height * 0.36, min(width, height) * 0.48); // 加上對手側柔光。
}

// 繪製標題列與戰鬥分數。
function drawHeader() {
  const compact = width < 600; // 窄螢幕使用較緊湊的標題排版。
  fill(245, 242, 229); // 設定主標題的暖白文字顏色。
  textAlign(LEFT, CENTER); // 標題與副標題靠左對齊。
  textStyle(BOLD); // 強調遊戲主標題。
  textSize(compact ? 19 : 24); // 依螢幕寬度調整標題字級。
  text("史料鬥技場", 22, 30); // 顯示遊戲名稱。
  textStyle(NORMAL); // 副標題恢復一般字重。
  fill(153, 174, 173); // 使用柔和灰綠色呈現副標題。
  textSize(compact ? 10 : 12); // 窄螢幕縮小副標題。
  text("HISTORY DUEL  /  國中歷史挑戰", 23, 53); // 顯示遊戲主題。
  textAlign(RIGHT, CENTER); // 分數資訊靠右排列。
  fill(243, 197, 104); // 分數使用明亮金黃色。
  textStyle(BOLD); // 強調分數數值。
  textSize(compact ? 15 : 18); // 讓分數在小螢幕仍然清楚。
  text("分數  " + score, width - 22, 31); // 顯示目前累積分數。
  fill(172, 190, 186); // 連擊數使用低調的輔助色。
  textStyle(NORMAL); // 連擊標籤使用一般字重。
  textSize(compact ? 11 : 13); // 依版面縮放連擊字級。
  text("連擊  " + combo, width - 22, 52); // 顯示目前連續答對數。
  textAlign(CENTER, CENTER); // 恢復中央對齊供其他畫面元件使用。
}

// 繪製對戰區域、兩位角色與生命值。
function drawBattlefield() {
  const compact = width < 600; // 窄螢幕縮小人物並調整對戰間距。
  const sceneTop = compact ? height * 0.11 : height * 0.13; // 計算對戰區的頂端位置。
  const sceneBottom = compact ? height * 0.48 : height * 0.52; // 計算對戰區的底端位置。
  const fighterSize = min(width * (compact ? 0.34 : 0.27), height * 0.34); // 依視窗比例限制人物最大尺寸。
  const fighterY = sceneTop + (sceneBottom - sceneTop) * 0.53; // 將人物置於舞台中央。
  const playerX = width * (compact ? 0.27 : 0.29); // 計算主角的水平位置。
  const enemyX = width * (compact ? 0.73 : 0.71); // 計算機器人的水平位置。
  drawHealthBar(playerX - fighterSize * 0.48, sceneTop, fighterSize * 0.96, playerHealth, "主角  你", color(65, 217, 184)); // 顯示主角名稱與生命值。
  drawHealthBar(enemyX - fighterSize * 0.48, sceneTop, fighterSize * 0.96, enemyHealth, "機器對手", color(255, 113, 87)); // 顯示機器對手生命值。
  drawPlayer(playerX, fighterY, fighterSize, playerDownUntil > millis()); // 受擊時繪製倒地的主角。
  const attackProgress = constrain(1 - (robotAttackUntil - millis()) / 420, 0, 1); // 計算機器人出拳動畫進度。
  const attackAmount = robotAttackUntil > millis() ? sin(attackProgress * PI) : 0; // 先出拳再收拳，形成完整動作。
  drawRobot(enemyX, fighterY, fighterSize, attackAmount); // 依動畫進度繪製機器人出拳。
  stroke(255, 255, 255, 38); // 設定中央分隔線的淡色外觀。
  line(width / 2, sceneTop + 12, width / 2, sceneBottom - 4); // 分隔競技場兩側。
  noStroke(); // 關閉外框，供下一個畫面元件使用。
  fill(245, 242, 229, 130); // 使用淡色標示人物所屬陣營。
  textSize(compact ? 10 : 12); // 控制人物標籤字級。
  text("答對出招", playerX, sceneBottom - 5); // 提示答對可攻擊對手。
  text("答錯受擊", enemyX, sceneBottom - 5); // 說明答錯時對手會反擊。
}

// 依照目前生命值繪製角色名稱與能量條。
function drawHealthBar(x, y, barWidth, health, label, barColor) {
  textAlign(LEFT, CENTER); // 生命值標籤由左側開始排列。
  fill(234, 239, 230); // 設定標籤文字顏色。
  textStyle(BOLD); // 強調陣營名稱。
  textSize(width < 600 ? 11 : 13); // 依螢幕大小調整名稱字級。
  text(label, x, y); // 顯示角色名稱。
  textAlign(RIGHT, CENTER); // 生命值數值靠右對齊。
  fill(189, 202, 195); // 設定數值的輔助文字顏色。
  textStyle(NORMAL); // 數值採用一般字重。
  textSize(width < 600 ? 10 : 12); // 依螢幕大小調整數值字級。
  text(max(0, health) + " / 100", x + barWidth, y); // 顯示目前與最大生命值。
  noStroke(); // 生命值底槽不需要外框。
  fill(255, 255, 255, 25); // 使用半透明白色畫出底槽。
  rect(x, y + 11, barWidth, 7, 4); // 畫出完整的生命值底槽。
  fill(barColor); // 使用陣營色表示剩餘生命值。
  rect(x, y + 11, barWidth * constrain(health / 100, 0, 1), 7, 4); // 依照生命值比例填滿能量條。
  textAlign(CENTER, CENTER); // 恢復其他介面文字的中央對齊。
}

// 以簡單圖形繪製玩家角色。
function drawPlayer(x, y, size, isDown) {
  push(); // 暫存畫布樣式，避免影響其他人物。
  translate(x + (isDown ? size * 0.08 : 0), y + (isDown ? size * 0.18 : 0)); // 受擊時讓主角向後倒下。
  rotate(isDown ? PI / 2 : 0); // 將主角旋轉成倒地姿勢。
  scale(size / 180); // 讓角色依照響應式尺寸等比例縮放。
  noStroke(); // 角色使用柔和色塊，不加外框。
  fill(65, 217, 184, 45); // 繪製主角身後的青綠色光圈。
  ellipse(0, 10, 168, 168); // 畫出人物背後的識別光圈。
  fill(43, 61, 58); // 使用深綠灰色繪製衣服陰影。
  rect(-46, 26, 92, 83, 25); // 畫出主角上半身。
  fill(65, 217, 184); // 使用明亮青綠色繪製主角外套。
  rect(-42, 22, 84, 82, 23); // 畫出主角衣服主體。
  fill(245, 201, 145); // 使用暖膚色繪製臉部。
  ellipse(0, -20, 67, 76); // 畫出主角頭部。
  fill(48, 42, 39); // 使用深色繪製頭髮。
  arc(0, -35, 69, 48, PI, TWO_PI); // 畫出主角瀏海與頭頂。
  ellipse(-25, -27, 19, 28); // 補上左側頭髮。
  ellipse(25, -27, 19, 28); // 補上右側頭髮。
  fill(34, 47, 45); // 使用深色點出眼睛。
  ellipse(-12, -16, 5, 7); // 畫出左眼。
  ellipse(12, -16, 5, 7); // 畫出右眼。
  stroke(115, 77, 58); // 設定微笑表情的線條顏色。
  strokeWeight(2); // 使用清楚但細緻的表情線條。
  noFill(); // 嘴角只畫線條，不填滿。
  arc(0, -5, 19, 11, 0, PI); // 畫出主角微笑。
  noStroke(); // 關閉線條以便繪製拳套。
  fill(245, 242, 229); // 使用暖白色繪製左手臂。
  rect(-58, 46, 24, 50, 12); // 畫出主角左手臂。
  fill(255, 128, 99); // 用珊瑚色作為主角拳套的亮點。
  ellipse(-47, 96, 29, 28); // 畫出主角左拳套。
  pop(); // 還原畫布樣式，避免角色設定外溢。
}

// 以簡單圖形繪製機器對手。
function drawRobot(x, y, size, attackAmount) {
  push(); // 暫存畫布樣式，避免影響其他人物。
  translate(x - size * 0.05 * attackAmount, y); // 出拳時讓機器人身體稍微前傾。
  scale(size / 180); // 讓機器人依照響應式尺寸等比例縮放。
  noStroke(); // 機器人使用色塊呈現金屬造型。
  fill(255, 113, 87, 42); // 繪製機器人身後的珊瑚色光圈。
  ellipse(0, 10, 168, 168); // 畫出機器人的識別光圈。
  fill(62, 72, 76); // 使用金屬灰繪製機器人身體。
  rect(-48, 27, 96, 83, 22); // 畫出機器人軀幹。
  fill(91, 109, 109); // 為機器人軀幹增加較亮的金屬面。
  rect(-41, 31, 82, 73, 18); // 畫出機器人胸前面板。
  fill(86, 102, 102); // 使用灰綠色繪製機器人頭部。
  rect(-38, -57, 76, 67, 20); // 畫出機器人的方形頭部。
  fill(38, 51, 53); // 使用深色畫出機器人的面罩。
  rect(-29, -42, 58, 34, 12); // 畫出機器人的臉部螢幕。
  fill(255, 133, 101); // 使用珊瑚色點亮機器人的電子眼。
  ellipse(-13, -25, 8, 8); // 畫出左側電子眼。
  ellipse(13, -25, 8, 8); // 畫出右側電子眼。
  fill(243, 197, 104); // 使用金黃色畫出頭頂天線。
  rect(-3, -70, 6, 15, 3); // 畫出天線支柱。
  ellipse(0, -72, 11, 11); // 畫出天線訊號燈。
  fill(255, 113, 87); // 用珊瑚色裝飾機器人胸口。
  rect(-12, 49, 24, 8, 4); // 畫出胸前狀態燈。
  fill(62, 72, 76); // 手臂以金屬灰色呈現。
  rect(34, 46, 25, 49, 12); // 畫出機器人右手臂。
  fill(243, 197, 104); // 機械拳使用金黃色作為對比。
  rect(39, 84, 33, 27, 10); // 畫出機器人的右拳。
  fill(62, 72, 76); // 使用金屬灰繪製朝主角方向攻擊的手臂。
  rect(-59 - attackAmount * 24, 45, 25 + attackAmount * 24, 20, 10); // 出拳時將機器人左手向前伸展。
  fill(243, 197, 104); // 以金黃色突顯機器人伸出的拳頭。
  ellipse(-62 - attackAmount * 48, 55, 30, 25); // 讓拳頭隨攻擊動畫向左移動。
  pop(); // 還原畫布樣式，避免角色設定外溢。
}

// 繪製題目卡片、四個答案按鈕與答題回饋。
function drawQuestionPanel() {
  const compact = width < 600; // 窄螢幕採用較緊湊的題目版面。
  const panelX = compact ? 14 : max(40, width * 0.12); // 計算題目卡片左側位置。
  const panelWidth = width - panelX * 2; // 計算題目卡片可用寬度。
  const panelY = compact ? height * 0.535 : height * 0.56; // 將題目卡片放在對戰區下方。
  const panelHeight = height - panelY - (compact ? 16 : 24); // 讓題目區延伸至畫面底部。
  const question = questions[questionIndex]; // 依照目前進度選取歷史題目，不循環重複。
  const cardRadius = compact ? 17 : 22; // 小螢幕卡片圓角略微縮小。
  noStroke(); // 題目卡片不顯示外框。
  fill(239, 235, 219); // 使用淺暖灰色建立清晰的閱讀區。
  rect(panelX, panelY, panelWidth, panelHeight, cardRadius); // 畫出題目與選項的底卡。
  fill(43, 61, 58); // 題目分類標籤使用深綠灰色。
  textAlign(LEFT, CENTER); // 標籤與題目均靠左排列。
  textStyle(BOLD); // 強調小節標籤。
  textSize(compact ? 10 : 12); // 依裝置調整小節字級。
  text("第 " + (questionIndex + 1) + " 題   /   歷史快問", panelX + 18, panelY + 22); // 顯示題目進度。
  fill(38, 49, 48); // 使用高對比深色呈現題目文字。
  textStyle(BOLD); // 題目使用粗體以方便閱讀。
  textSize(compact ? 16 : 21); // 窄螢幕採用較小題目字級。
  textWrap(WORD); // 允許較長題目依單字自然換行。
  text(question.question, panelX + 18, panelY + (compact ? 58 : 66), panelWidth - 36, compact ? 48 : 54); // 顯示目前歷史題目。
  const choices = getChoiceRects(panelX, panelWidth, panelY, panelHeight, compact); // 取得答案按鈕的版面位置。
  for (let index = 0; index < choices.length; index += 1) { // 逐一繪製四個選項。
    const choice = choices[index]; // 取得目前答案選項與位置。
    const isSelected = selectedAnswer === index; // 判斷此選項是否為玩家剛選的答案。
    const isCorrect = question.answer === index; // 判斷此選項是否為正確答案。
    let fillColor = color(255, 255, 255, 160); // 未選擇的選項使用淡色底。
    if (answerLocked && isCorrect) fillColor = color("#a7c957"); // 作答後以指定綠色標示正確答案。
    if (answerLocked && isSelected && !isCorrect) fillColor = color("#e63946"); // 答錯時以指定紅色標示選擇。
    fill(fillColor); // 套用目前答案按鈕顏色。
    rect(choice.x, choice.y, choice.w, choice.h, compact ? 10 : 12); // 畫出答案按鈕背景。
    fill(38, 49, 48); // 使用深色文字維持答案的閱讀對比。
    textAlign(CENTER, CENTER); // 讓答案文字在按鈕中央對齊。
    textStyle(BOLD); // 讓整個答案選項清楚易讀。
    textSize(compact ? 12 : 15); // 依版面調整答案字級。
    text((index + 1) + ". " + question.choices[index], choice.x + 8, choice.y + 2, choice.w - 16, choice.h - 4); // 以按鈕內的文字框置中呈現編號與答案。
  }
  drawFeedback(panelX, panelWidth, panelY, panelHeight, compact); // 顯示作答結果或操作提示。
  textAlign(CENTER, CENTER); // 還原文字對齊，供其他畫面區域使用。
}

// 計算答案選項的位置，讓滑鼠與觸控共用同一套座標。
function getChoiceRects(panelX, panelWidth, panelY, panelHeight, compact) {
  const gap = compact ? 8 : 10; // 設定按鈕間距。
  const innerX = panelX + (compact ? 16 : 20); // 計算卡片內側左右留白。
  const innerWidth = panelWidth - (compact ? 32 : 40); // 計算按鈕可用總寬度。
  const top = panelY + (compact ? 91 : 108); // 計算第一排按鈕的起始位置。
  const rowGap = compact ? 7 : 9; // 設定兩排選項之間的距離。
  const feedbackSpace = compact ? 94 : 100; // 將作答結果與解析保留在選項下方。
  const availableHeight = panelHeight - (compact ? 91 : 108) - feedbackSpace; // 依卡片高度計算選項可用空間。
  const buttonHeight = max(compact ? 28 : 32, (availableHeight - rowGap) / 2); // 視窗較矮時縮小選項，避免與解析重疊。
  const buttonWidth = (innerWidth - gap) / 2; // 兩欄平均分配選項寬度。
  return questions[questionIndex].choices.map((choice, index) => ({ // 依選項數量建立按鈕座標。
    x: innerX + (index % 2) * (buttonWidth + gap), // 設定目前選項的水平位置。
    y: top + floor(index / 2) * (buttonHeight + rowGap), // 設定目前選項的垂直位置。
    w: buttonWidth, // 儲存目前選項的寬度。
    h: buttonHeight // 儲存目前選項的高度。
  })); // 回傳所有選項的座標資料。
}

// 在題目卡片底部顯示正誤結果或鍵盤提示。
function drawFeedback(panelX, panelWidth, panelY, panelHeight, compact) {
  const messageY = panelY + panelHeight - (compact ? 70 : 76); // 將錯誤提示與解析往下移並保留底部間距。
  textAlign(LEFT, TOP); // 回饋訊息與解析靠左排列。
  textStyle(BOLD); // 回饋訊息使用粗體提高辨識度。
  textSize(compact ? 11 : 13); // 手機提示文字稍微縮小。
  if (answerLocked) { // 玩家作答後顯示正確或錯誤結果。
    const question = questions[questionIndex]; // 取得目前題目與解析。
    const isCorrect = selectedAnswer === question.answer; // 比對所選答案與正解。
    fill(isCorrect ? color("#a7c957") : color("#e63946")); // 依照作答結果切換指定的正誤顏色。
    text(isCorrect ? "答對！重擊命中" : "答錯了，正確答案是：" + question.choices[question.answer], panelX + 18, messageY); // 顯示戰鬥結果與正確答案。
    if (!isCorrect) { // 答錯時補充正解的歷史背景。
      fill(65, 81, 74); // 解析使用清楚易讀的深灰綠色。
      textStyle(NORMAL); // 解析採一般字重。
      textSize(compact ? 10 : 12); // 解析字級兼顧手機空間與可讀性。
      textWrap(CHAR); // 中文解析依字元換行，避免長句超出卡片。
      text(question.explanation, panelX + 18, messageY + (compact ? 20 : 23), panelWidth - 36, compact ? 45 : 50); // 顯示為何正解正確。
    }
  } else { // 尚未作答時顯示操作方式。
    fill(93, 113, 106); // 使用低對比度文字作為輔助提示。
    textAlign(LEFT, CENTER); // 操作提示維持單行垂直置中。
    text("點選答案" + (compact ? "" : "  /  鍵盤按 1–4 作答"), panelX + 18, panelY + panelHeight - (compact ? 17 : 20)); // 提醒玩家如何選擇答案。
  }
  textAlign(CENTER, CENTER); // 還原文字對齊。
}

// 接收滑鼠與觸控點擊，將選項點擊轉為一次作答。
function mousePressed() {
  if (gameResult !== "playing") { // 遊戲結束後點擊畫面可重新開始。
    resetGame(); // 初始化雙方生命值與分數。
    return false; // 避免瀏覽器接續執行預設滑鼠行為。
  }
  if (answerLocked) return false; // 回饋動畫期間忽略重複點擊。
  const compact = width < 600; // 依照目前螢幕寬度取得正確按鈕版面。
  const panelX = compact ? 14 : max(40, width * 0.12); // 計算題目卡片左側位置。
  const panelWidth = width - panelX * 2; // 計算題目卡片寬度。
  const panelY = compact ? height * 0.535 : height * 0.56; // 計算題目卡片垂直位置。
  const panelHeight = height - panelY - (compact ? 16 : 24); // 計算題目卡片高度。
  const choices = getChoiceRects(panelX, panelWidth, panelY, panelHeight, compact); // 取得每個答案按鈕的位置。
  for (let index = 0; index < choices.length; index += 1) { // 逐一檢查點擊是否落在某個答案按鈕。
    const choice = choices[index]; // 取得目前檢查的按鈕位置。
    if (mouseX >= choice.x && mouseX <= choice.x + choice.w && mouseY >= choice.y && mouseY <= choice.y + choice.h) { // 判斷滑鼠或手指是否點中選項。
      answerQuestion(index); // 送出點中的答案。
      return false; // 停止繼續檢查其他選項。
    }
  }
  return false; // 阻止觸控裝置點擊時捲動網頁。
}

// 接收鍵盤輸入，數字 1 至 4 作答，Enter 重新開始。
function keyPressed() {
  if (gameResult !== "playing" && (keyCode === ENTER || keyCode === RETURN)) { // 結算畫面按 Enter 可再次挑戰。
    resetGame(); // 重設遊戲狀態。
    return false; // 阻止 Enter 觸發瀏覽器預設行為。
  }
  if (key >= "1" && key <= "4") answerQuestion(Number(key) - 1); // 將數字鍵轉成答案選項編號。
  return false; // 避免遊戲操作觸發瀏覽器快捷行為。
}

// 判斷答案正誤並執行攻擊、受擊與分數更新。
function answerQuestion(answerIndex) {
  if (gameResult !== "playing" || answerLocked) return; // 遊戲結束或動畫期間不接受新答案。
  selectedAnswer = answerIndex; // 記錄玩家剛選擇的答案。
  answerLocked = true; // 鎖住答案按鈕，避免重複計分。
  feedbackUntil = millis() + 3500; // 保留足夠時間閱讀答題結果與錯題解析。
  const correctAnswer = questions[questionIndex].answer; // 取得目前題目的正確答案。
  if (answerIndex === correctAnswer) { // 答對時扣除機器人的生命值。
    enemyHealth = max(0, enemyHealth - 25); // 每次答對造成 25 點傷害。
    score += 100 + combo * 20; // 連擊越高，答對獎勵越多。
    combo += 1; // 累加連續答對次數。
    if (enemyHealth <= 0) gameResult = "win"; // 機器人生命值歸零時判定勝利。
  } else { // 答錯時由機器人反擊主角。
    playerHealth = max(0, playerHealth - 20); // 每次答錯受到 20 點傷害。
    combo = 0; // 答錯後中斷連擊。
    hitFlash = millis() + 180; // 觸發短暫的受擊閃光。
    playerDownUntil = millis() + 1050; // 讓主角在錯答回饋期間保持倒地。
    robotAttackUntil = millis() + 420; // 播放機器人出拳並收回的動畫。
    if (playerHealth <= 0) gameResult = "lose"; // 主角生命值歸零時判定失敗。
  }
}

// 計時結束後切換至下一題，並處理受擊畫面回復。
function drawResultOverlay() {
  if (hitFlash > millis()) { // 受擊時短暫覆蓋一層紅色閃光。
    noStroke(); // 閃光覆蓋層不需要外框。
    fill(255, 78, 60, 32); // 使用低透明度珊瑚紅。
    rect(0, 0, width, height); // 讓整個畫面短暫閃紅。
  }
  if (answerLocked && gameResult === "playing" && millis() >= feedbackUntil) { // 回饋結束且遊戲仍在進行時切換題目。
    questionIndex += 1; // 進入下一題。
    selectedAnswer = -1; // 清除上一題的選擇狀態。
    answerLocked = false; // 重新開放答案輸入。
  }
  if (gameResult === "playing") return; // 遊戲進行中不顯示結算畫面。
  fill(12, 20, 23, 205); // 為結算視窗鋪上半透明遮罩。
  rect(0, 0, width, height); // 遮住競技場背景，聚焦遊戲結果。
  const boxWidth = min(width - 36, 420); // 限制結算視窗寬度並保留手機邊距。
  const boxHeight = 220; // 固定結算視窗高度，避免內容跳動。
  const boxX = (width - boxWidth) / 2; // 將結算視窗水平置中。
  const boxY = (height - boxHeight) / 2; // 將結算視窗垂直置中。
  fill(239, 235, 219); // 結算視窗使用與題目卡一致的暖白底色。
  rect(boxX, boxY, boxWidth, boxHeight, 20); // 畫出結算視窗。
  fill(gameResult === "win" ? color("#a7c957") : color("#e63946")); // 勝利與失敗沿用指定的正誤顏色。
  textStyle(BOLD); // 強調最終結果。
  textSize(width < 600 ? 27 : 34); // 窄螢幕略微縮小結果標題。
  text(gameResult === "win" ? "挑戰成功！" : "再接再厲！", width / 2, boxY + 63); // 顯示勝利或失敗文字。
  fill(58, 75, 68); // 使用深綠灰顯示結算資訊。
  textStyle(NORMAL); // 說明文字使用一般字重。
  textSize(15); // 設定結算說明的閱讀字級。
  text("最終分數　" + score + "　　答對連擊　" + combo, width / 2, boxY + 111); // 顯示分數與最後連擊。
  fill(43, 61, 58); // 重新開始按鈕採用深色底。
  rect(width / 2 - 93, boxY + 147, 186, 44, 12); // 畫出重新挑戰按鈕。
  fill(245, 242, 229); // 按鈕文字使用暖白色。
  textStyle(BOLD); // 強調重新開始指令。
  textSize(14); // 設定按鈕文字大小。
  text("重新挑戰　／　按 Enter", width / 2, boxY + 169); // 提示重新開始方式。
  textStyle(NORMAL); // 還原文字字重，避免影響後續繪圖。
}

// 將遊戲狀態還原，讓玩家可以立即重新挑戰。
function resetGame() {
  playerHealth = 100; // 恢復主角生命值。
  enemyHealth = 100; // 恢復機器對手生命值。
  score = 0; // 清除上一局的分數。
  combo = 0; // 清除上一局的連擊。
  questionIndex = 0; // 回到第一道歷史題目。
  shuffleQuestions(); // 重新挑戰時也重新排列題目。
  selectedAnswer = -1; // 清除答案選擇狀態。
  answerLocked = false; // 開放新一局的答案輸入。
  gameResult = "playing"; // 將遊戲狀態設回進行中。
  hitFlash = 0; // 清除上一局留下的受擊閃光。
  playerDownUntil = 0; // 清除主角倒地狀態。
  robotAttackUntil = 0; // 清除機器人出拳狀態。
}

// 使用 Fisher–Yates 演算法打亂題庫，確保每題在一輪中只出現一次。
function shuffleQuestions() {
  for (let index = questions.length - 1; index > 0; index -= 1) {
    const otherIndex = Math.floor(Math.random() * (index + 1));
    [questions[index], questions[otherIndex]] = [questions[otherIndex], questions[index]];
  }
}