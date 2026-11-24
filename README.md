# 🇮🇩 Halo Indo - 인도네시아어 학습 & Gemini AI 튜터

순수 HTML, CSS, JavaScript로 제작된 인도네시아어 학습 웹 앱입니다.
Google Gemini의 최신 모델 **`gemini-3.8-flash`** 기반 AI 튜터가 탑재되어 있습니다.

---

## 📂 GitHub에 올릴 파일 목록 (수동 업로드 대상)

이 프로젝트는 별도의 Node.js 설치나 빌드 과정이 없는 순수 프론트엔드 프로젝트입니다.
GitHub 저장소에 **아래 4개 파일**을 그대로 올리시면 됩니다:

| 파일명 | 역할 | 설명 |
|---|---|---|
| `index.html` | 웹 앱 메인 페이지 | 단어 카드, 퀴즈, AI 튜터 탭 및 모달 UI |
| `style.css` | 디자인 스타일시트 | 반응형 레이아웃, 3D 카드 뒤집기, 채팅창 UI |
| `app.js` | 앱 핵심 로직 | 단어 데이터, 음성 발음(TTS), 퀴즈 및 **Gemini API 연동** |
| `README.md` | 프로젝트 안내 문서 | 배포 및 사용 설명서 |

> [!IMPORTANT]
> **보안 안내**: API 키는 코드에 하드코딩되어 있지 않으며, 각 사용자가 브라우저 화면에서 직접 입력하여 본인 브라우저(`localStorage`)에만 저장되므로 **GitHub에 코드를 공개(Public)로 올려도 API 키 유출 위험이 전혀 없습니다.**

---

## 📤 GitHub에 수동으로 올리는 방법 (2가지 중 택1)

### 1. 웹 브라우저에서 드래그 앤 드롭으로 올리기 (가장 간편!)
1. [GitHub](https://github.com/)에 로그인하고 **[New repository]** 버튼을 눌러 새 저장소를 만듭니다. (예: `halo-indo`)
2. 저장소 생성 후 나오는 첫 화면에서 **"uploading an existing file"** 링크를 클릭합니다.
3. 내 컴퓨터의 이 폴더(`index.html`, `style.css`, `app.js`, `README.md`)를 선택하여 브라우저 화면 안으로 끌어다 넣습니다(Drag & Drop).
4. 아래쪽의 초록색 **[Commit changes]** 버튼을 누르면 업로드가 완료됩니다!

### 2. Git 명령어로 올리기 (터미널)
```bash
git init
git add index.html style.css app.js README.md
git commit -m "feat: 인도네시아어 학습 앱 & Gemini 3.8 Flash AI 튜터"
git branch -M main
git remote add origin https://github.com/내아이디/내레포지토리이름.git
git push -u origin main
```

---

## 🌐 Netlify 배포 방법

1. [Netlify](https://www.netlify.com/) 로그인 후 **"Add new site" > "Import an existing project"** 클릭.
2. 방금 올린 **GitHub 저장소**를 선택합니다.
3. 빌드 설정:
   - **Build command**: 비워둠 (빈칸)
   - **Publish directory**: `.` (또는 빈칸)
4. **[Deploy site]** 클릭 → 10초 만에 배포 완료!

---

## 🤖 AI 튜터 사용 방법 (gemini-3.8-flash)
1. 상단의 **"🔑 API 키 설정"** 버튼을 누릅니다.
2. [Google AI Studio](https://aistudio.google.com/app/apikey)에서 무료로 발급받은 Gemini API Key를 입력하고 저장합니다.
3. **🤖 AI 튜터** 탭에서 상황별 회화, 번역, 문장 교정 등을 자유롭게 질문할 수 있습니다!
