# node version
- v18.17.1 

# pmpn
上記の Node version で以下のコマンドでインストールしてください。
- npm install -g pnpm

# install
pnpm i

# 起動
pnpm dev

# Deploy 
githubの feature-ブランチを developブランチにPR作成し、マージすると vercel stagingにデプロイされます

# 今後やりたいこと

### フロントエンドの自動テストがしたい。

### どんな指針でテストを設計するのがいいか？

Testing PyramidとTesting Torophyという概念がある。
Testing Pyramidは大規模開発向けのようで今回はTesting Torophyで指針を考えてみる。
Testing TorophyではIntegrationテストを最も重視している。

```
単体テストのみでは単一の機能同士が結合した時に正しく動作をするかの確証を得ることができません。
そのため機能同士の繋がりをテストできるIntegrationテストを一番多く書くことが、コストとテストの信頼度のトレードオフを考える上で一番有用であるとTesting Trophyは示しています。
```

各テストでどんなテストを実施するか。  
E2E（機能テスト）: CypressやPlaywrightを使用  
Integration（結合テスト）: JestやReact Testing Libraryを使用  
Unit（単体テスト）: JestやReact Testing Libraryを使用  
Static（静的テスト）: ESLintやPrettierを使用  


#### Jest: 単体テストやスナップショットテストが可能
下記のようにテストを開始する構文を作成する役割がある。
```
describe('CounterButton Component', () => {
  ...
});
```

これとRTLを組み合わせてコンポーネントのテストをすることが可能。

#### React Testing Library(RTL): Reactコンポーネントのテストが可能  
下記のようなテストが可能

```
test('新規作成ボタンが画面に表示されていること', () => {
  // コンポーネントをレンダリング
  render(<UserForm />);

  // テストしたい要素を取得
  const createButton = screen.getByRole('button', { name: /新規作成/i });

  // 取得した要素が画面に表示されているかを確認
  expect(createButton).toBeInTheDocument();
});
```
test-utilsを使うと便利にテストができる。
コンポーネント同士の結合に関してもテストできる。
recoil等の状態管理も加味したテストができる。

#### Enzyme: コンポーネント構造の検査が可能

RTLの方が主流のようなので今回は検討しない。

#### テストコードを書くときに意識すること。
```
開発を終えてからテストをするよりも設計時点で見えているテストケースは開発するタイミングと同時にテストケースとして洗い出しておくのが個人的には良いと思っています。
```
```
リファクタしただけなのにテストが壊れてその修正にまた時間がかかるなんてことは業務の中でもある程度起こってしまうことですので、変数の値など（実装の詳細）を確認するテストを書くのではなくユーザーが確認できるものに対してのテストを書くように意識するべきです。
```


#### CICDの構築の時に意識すること
```
CI/CDパイプラインの中で自動テストを組んだりすると思います。保守期間中は自動テストは全て成功していることを前提にしたパイプラインであってほしいが、開発期間中はテストコード実装前なので失敗するだけのコードがある時には失敗を許容するなど、状況によってパイプラインを直すこともあると思います。
```


### バックエンドの自動テストがしたい。

jestを使用するのがいいらしい。
例えば、ExpressとSupertestとMockingでテストする場合。
下記のような感じでテストできる。

```
const express = require('express');
const app = express();

app.get('/api/data', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

module.exports = app;
```

```
const request = require('supertest');
const app = require('./app'); // APIの実装が含まれるファイルのパス

describe('GET /api/data', () => {
  it('should return Hello World', async () => {
    const response = await request(app).get('/api/data');
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Hello World');
  });
});
```

```
jest.mock('../someExternalService', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: 'mocked data' })
}));
```



