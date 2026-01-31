export function getETDate(utcDate: Date = new Date()): Date {
  // アメリカ東部時間（EST/EDT）のオフセット
  // 夏時間考慮: 3月第2日曜日〜11月第1日曜日はEDT（UTC-4）、それ以外はEST（UTC-5）
  const year = utcDate.getUTCFullYear();

  // 夏時間の開始と終了日を計算
  const dstStart = getNthSundayOfMonth(year, 3, 2); // 3月第2日曜日
  const dstEnd = getNthSundayOfMonth(year, 11, 1); // 11月第1日曜日

  const isDST = utcDate >= dstStart && utcDate < dstEnd;
  const etOffset = isDST ? -4 * 60 * 60 * 1000 : -5 * 60 * 60 * 1000; // EDT: UTC-4, EST: UTC-5

  return new Date(utcDate.getTime() + etOffset);
}

function getNthSundayOfMonth(year: number, month: number, n: number): Date {
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const firstSunday = new Date(firstDay);
  firstSunday.setUTCDate(1 + ((7 - firstDay.getUTCDay()) % 7));

  const nthSunday = new Date(firstSunday);
  nthSunday.setUTCDate(firstSunday.getUTCDate() + (n - 1) * 7);

  return nthSunday;
}

export function getETMidnight(etDate: Date): Date {
  const year = etDate.getUTCFullYear();
  const month = etDate.getUTCMonth();
  const day = etDate.getUTCDate();

  // ET時間での真夜中をUTC時間に変換
  const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  const etDateForMidnight = getETDate(utcDate);

  // ET時間での日付を取得
  const etYear = etDateForMidnight.getUTCFullYear();
  const etMonth = etDateForMidnight.getUTCMonth();
  const etDay = etDateForMidnight.getUTCDate();

  // その日のET真夜中のUTC時間を計算
  const isDST = isDateInDST(new Date(Date.UTC(etYear, etMonth, etDay)));
  const offsetHours = isDST ? 4 : 5; // EDT: UTC+4, EST: UTC+5 で真夜中に戻す

  return new Date(Date.UTC(etYear, etMonth, etDay, offsetHours, 0, 0, 0));
}

function isDateInDST(date: Date): boolean {
  const year = date.getUTCFullYear();
  const dstStart = getNthSundayOfMonth(year, 3, 2);
  const dstEnd = getNthSundayOfMonth(year, 11, 1);
  return date >= dstStart && date < dstEnd;
}

export function getCurrentDayIdx(): number {
  const now = new Date();
  const etNow = getETDate(now);
  const etMidnight = getETMidnight(etNow);
  const daysSinceEpoch = Math.floor(
    etMidnight.getTime() / (24 * 60 * 60 * 1000),
  );
  return 6;
}

export function generateCompletionCode(): string {
  // const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  // const segments = [4, 4, 4];
  // const code = segments
  //   .map((len) => {
  //     let segment = "";
  //     for (let i = 0; i < len; i++) {
  //       segment += chars.charAt(Math.floor(Math.random() * chars.length));
  //     }
  //     return segment;
  //   })
  //   .join("-");

  // // 真ん中の文字（7文字目、ハイフンを含めると8文字目）を'S'に固定
  // const codeArray = code.split("");
  // codeArray[12] = "A"; // XXXX-XXSX-XXAX の A
  // codeArray[13] = "B"; // XXXX-XXXX-XXXB の B

  // return `COMP-${codeArray.join("")}`;
  return "COMP-ESGT-GRAD-ETAB";
}
