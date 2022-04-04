const properties = PropertiesService.getScriptProperties().getProperties();
const WEBHOOK_URL: string = properties.WEBHOOK_URL;

type FormResponse = string | string[] | string[][];

const formResponseToString = (s: FormResponse): string => {
  switch (typeof s) {
    case 'string':
      return s;
    case 'object':
      switch (typeof s[0]) {
        case 'string':
          return s.join('\n');
        case 'object':
          // 二次元配列を一次元にしてそれを'\n'区切りのstringに
          return [].concat(s).join('\n');
        default:
          return '';
      }
    default:
      return '';
  }
};

const onSubmit = (e: any) => {
  const response: GoogleAppsScript.Forms.FormResponse = e.response;
  const itemResponses: GoogleAppsScript.Forms.ItemResponse[] = response.getItemResponses();

  let respondentName: string = '';
  let studentNumber: string = '';

  for (const itemResponse of itemResponses) {
    const title: string = itemResponse.getItem().getTitle();
    const res: FormResponse = itemResponse.getResponse();
    const strRes: string = formResponseToString(res);

    if (title === 'あなたのお名前') {
      respondentName = strRes;
    }

    if (title === 'あなたの学籍番号') {
      studentNumber = strRes;
    }
  }

  const heading: string = '新入生質問箱に回答がありました。\n';
  const name: string = '名前 : ' + respondentName + '\n';
  const stuNum: string = '学籍番号 : ' + studentNumber + '\n';

  const data: string = heading + name + stuNum;


  const body: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      content: data
    })
  }

  UrlFetchApp.fetch(WEBHOOK_URL, body)
}

const main = (e: any) => {
  onSubmit(e);
};