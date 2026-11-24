# 🇮🇩 Halo Indo - 인도네시아어 학습 웹 앱 (Netlify 배포 연습용)

순수 HTML, CSS, JavaScript로 제작된 인도네시아어 단어장 & 미니 퀴즈 웹 애플리케이션입니다.
별도의 빌드 과정(Node.js, npm, webpack 등)이 전혀 필요 없어 **Netlify에 10초 만에 배포**할 수 있습니다.

---

## 🚀 Netlify에 배포하는 가장 쉬운 2가지 방법

### 방법 1: 드래그 앤 드롭 (가장 추천! 10초 컷)
1. [Netlify 사이트](https://www.netlify.com/)에 로그인합니다.
2. 상단 메뉴에서 **Sites** 로 이동합니다.
3. 화면 아래에 있는 **"Want to deploy a new site without connecting to Git? Drag and drop your team site to deploy"** 영역을 찾습니다.
4. 이 프로젝트 폴더(`261124test`)를 통째로 마우스로 끌어서 점선 박스 안에 **드롭(Drop)** 합니다.
5. 1~2초 후 배포가 완료되며, 생성된 무료 URL(`https://xxxxx.netlify.app`)을 클릭하여 바로 앱을 확인할 수 있습니다!

---

### 방법 2: GitHub 연결 후 자동 배포 (실제 개발 워크플로우 연습)
1. GitHub에 새 저장소(Repository)를 생성합니다.
2. 이 폴더의 코드를 GitHub에 푸시합니다:
   ```bash
   git init
   git add .
   git commit -m "feat: 초간단 인도네시아어 학습 앱"
   git branch -M main
   git remote add origin <사용자_깃허브_레포_URL>
   git push -u origin main
   ```
3. Netlify 대시보드에서 **"Add new site" > "Import an existing project"** 클릭.
4. **GitHub**를 선택하고 생성한 저장소를 연결합니다.
5. 빌드 설정(Build settings) 확인:
   - **Build command**: 비워둠 (빈칸)
   - **Publish directory**: `.` 또는 비워둠
6. **"Deploy site"** 버튼을 클릭하면 즉시 배포되며, 이후 코드를 Git에 push할 때마다 자동으로 새로 배포됩니다!

---

## 📱 앱 주요 기능
- **단어 카드(Flashcard)**: 카드를 클릭하여 3D 뒤집기 효과로 뜻과 예문 확인
- **발음 듣기 (TTS)**: 브라우저 Web Speech API를 활용한 인도네시아어 음성 재생
- **카테고리 필터**: 전체, 기초 인사, 필수 일상, 숫자
- **미니 퀴즈**: 4지선다형 객관식 퀴즈 (5문제 세트, 점수 산출 및 결과 피드백)
- **반응형 디자인**: 모바일 스마트폰 화면과 PC 모두에 최적화
