# Спецификация игры: Patient Journey Simulator

## 1. Обзор и сюжет

**Название:** The Patient Journey Simulator (Симулятор пути пациента).

**Контекст:** Игрок только что возглавил цифровые операции в больнице с проблемами. До аудита остаётся 8 недель. Цель — уменьшить задержки при приёме, сократить ручную работу и улучшить движение данных пациента между этапами оказания помощи.

**Структура:** Два блока решений (FHIR-сервер и адаптивные формы). 11 решений. Один итоговый результат аудита.

**Время прохождения:** ~5 минут. Регистрация не требуется.

---

## 2. Механика игры

### 2.1 Экраны

| Экраны | Описание |
|--------|----------|
| **Start** | Приветствие, описание вызова, кнопка «Start». |
| **Game** | Игровой экран: заголовок с метриками и счётчиком шагов, карточка сцены, вопрос, 4 варианта ответа, полоска прогресса (11 точек). |
| **Overlay: FHIR Reveal** | После выбора продукта FHIR — модальное окно с названием продукта и подзаголовком, кнопка «Continue». |
| **Overlay: Forms Reveal** | После выбора продукта форм — модальное окно с названием продукта и подзаголовком, кнопка «Continue». |
| **Outcome** | Итог: заголовок результата, подзаголовок, выбранные FHIR/Forms пути, три метрики в процентах, шаринг (LinkedIn, Facebook, WhatsApp, копирование ссылки, скачивание карточки), «Play again». |

### 2.2 Состояние (state)

- **metrics:** `patientComfort`, `staffEffectiveness`, `dataReadiness` — числа 0–100.
- **selectedFhirProduct:** `null` или один из: `HAPI`, `Medplum`, `Aidbox`, `Firely`.
- **selectedFormsProduct:** `null` или один из: `Formstack`, `form.io`, `Formbox`, `Luma Health`.
- **currentQuestion:** индекс текущего вопроса (0–10).
- **answers:** массив индексов выбранных вариантов (0–3 для каждого вопроса).
- **lead:** `{ name, organization, email }` — для лид-формы (если используется).

### 2.3 Начальные значения метрик

- Patient Comfort: **25**
- Staff Effectiveness: **25**
- Data Readiness: **25**

### 2.4 Порядок вопросов

Всего **11 шагов** (индексы 0–10):

- **0–3:** Блок FHIR (4 сценария).
- **4:** Вопрос product-fit по FHIR (выбор сервера).
- **5–8:** Блок Adaptive Forms (4 сценария).
- **9:** Вопрос product-fit по формам (выбор платформы форм).
- **10:** Финальный сценарий — операционализация FHIR и форм перед аудитом (q11-final-audit).

После ответа на вопрос 4 показывается overlay с раскрытием FHIR-продукта, затем переход к вопросу 5. После ответа на вопрос 9 показывается overlay с раскрытием продукта форм, затем переход к вопросу 10 (q11-final-audit). После ответа на вопрос 10 вызываются applyOptionDeltas, сохраняется ответ, через 600 ms показывается экран Outcome.

---

## 3. Метрики и начисление баллов

### 3.1 Три метрики

| Ключ в коде | Отображаемое название | Иконка (кратко) |
|-------------|------------------------|------------------|
| `patientComfort` | Patient comfort | Пациент |
| `staffEffectiveness` | Staff comfort | Плюс/крест |
| `dataReadiness` | Data readiness | Документ |

### 3.2 Диапазон и ограничения

- Все метрики: **0–100**.
- Верхняя граница (cap): **100**.
- После применения дельты значение ограничивается: `Math.max(0, Math.min(100, текущее + delta))`.

### 3.3 Дельты за ответы (только сценарии)

К счётчикам применяются **только** ответы на сценарии (вопросы 0–3, 5–8 и 10). Вопросы product-fit (4 и 9) **не меняют** метрики.

Возможные дельты по одной метрике: **+8**, **+3**, **-1**.

- **+8** → зелёный индикатор (лучший эффект).
- **+3** → жёлтый (частичный эффект).
- **-1** → красный (ухудшение).

Формула применения при выборе варианта:

- `patientComfort += option.pc`
- `staffEffectiveness += option.se`
- `dataReadiness += option.dr`

(с учётом ограничения 0–100 для каждой.)

### 3.4 Визуализация метрик в UI

- Шкала заполнения по контуру (stroke-dasharray) в зависимости от значения 0–100.
- Цвет иконки по диапазону значения:
  - **0–39:** красный.
  - **40–69:** жёлтый.
  - **70–100:** зелёный.

У вариантов ответа рядом с текстом показываются три иконки (Patient / Staff / Data) с цветом по дельте (зелёный / жёлтый / красный). Числа дельт в UI не отображаются.

---

## 4. Вопросы, варианты ответов и баллы

Ниже для каждого вопроса указаны: id, заголовок сцены, текст сцены, вопрос и варианты с дельтами (pc, se, dr) или productId.

---

### Блок 1: FHIR Server

**Вступление к блоку (blockIntro):**  
*You have inherited a hospital environment where patient information moves inconsistently across registration, departments, and partner workflows. Some teams have created local fixes that help in the moment, but they do not always scale well across the full care journey. Over the next few weeks, you need to improve reliability without losing momentum on day-to-day operations.*

---

#### Q1 — Регистрация утром

- **id:** `q1`
- **title:** Monday, 8:10 AM
- **sceneText:** The registration area is already backed up. Several patients are late for diagnostics, the front desk is juggling phone calls, and a line is starting to form near the self-check-in kiosk. A message from the CFO appears on your screen: "We cannot start every week like this. Fix the bottleneck before it hits revenue and patient satisfaction again." Any near-term change has to fit the current operational setup rather than depend on a major redesign.
- **question:** How do you reduce the morning registration bottleneck?

| Вариант | Текст | PC | SE | DR |
|--------|--------|----|----|-----|
| A | Open a fast lane for returning patients and temporarily move one nurse from triage to support check-in. | +8 | -1 | +3 |
| B | Cut registration to the minimum required questions and ask departments to collect missing details later. | +8 | +3 | -1 |
| C | Prepare a daily pre-filled registration list from scheduled appointments so staff type less at the desk. | +3 | +8 | -1 |
| D | Prioritize patients heading to diagnostics first and move routine follow-ups into a slower secondary lane. | -1 | +8 | +3 |

---

#### Q2 — Повторяющиеся вопросы

- **id:** `q2`
- **title:** By noon
- **sceneText:** Complaints shift from waiting time to repetition. One patient says she has now given her contact details, medication list, and insurance information three times in one visit. The outpatient lead pings you: "We are moving people through the building, but not their information." The team needs a practical way to reduce repetition without introducing another workaround that staff will have to maintain manually.
- **question:** How do you reduce repeated questions across departments?

| Вариант | Текст | PC | SE | DR |
|--------|--------|----|----|-----|
| A | Print a short intake summary at registration and ask patients to carry it from one department to the next. | +3 | +8 | -1 |
| B | Tell departments to skip repeated questions unless staff notice a clear inconsistency. | +8 | +3 | -1 |
| C | Add a patient-flow coordinator who reconciles mismatched answers before the next appointment starts. | +3 | -1 | +8 |
| D | Introduce one shared core intake block for all departments, while specialty questions stay local. | +8 | -1 | +3 |

---

#### Q3 — Передача данных между этапами

- **id:** `q3`
- **title:** Data handoff
- **sceneText:** A patient completes diagnostics, but the specialist still cannot see the updated medication note and calls the department directly. Another case is held for ten minutes because the receiving team is not sure which prep instructions were already given. A message from the medical director lands: "Why are clinicians still chasing information in chats and calls?" Whatever you improve here has to work in real clinical conditions, not just on paper.
- **question:** How do you improve data handoff between care steps?

| Вариант | Текст | PC | SE | DR |
|--------|--------|----|----|-----|
| A | Require the sending team to email a short patient summary before every internal transfer. | +8 | -1 | +3 |
| B | Let the receiving team confirm missing details directly with the patient at the next step. | -1 | +8 | +3 |
| C | Make transfer completion depend on a mandatory handoff checklist filled out by the sending team. | +3 | -1 | +8 |
| D | Use a shared hourly handoff board so departments see the latest status in one place before calling each other. | -1 | +3 | +8 |

---

#### Q4 — Новый партнёрский процесс

- **id:** `q4`
- **title:** New partner workflow
- **sceneText:** The hospital is preparing to launch a new pre-op testing workflow with an external lab partner. Commercially, the timing matters: leadership wants it live this month. The partnerships manager sends a blunt note: "Every new workflow feels like a new integration project. We cannot keep rebuilding the hospital from scratch." Leadership wants an approach that helps with this launch and does not make future partner onboarding harder.
- **question:** How do you launch the new partner workflow?

| Вариант | Текст | PC | SE | DR |
|--------|--------|----|----|-----|
| A | Start immediately with PDF results by email and let staff upload them into existing records manually. | +8 | -1 | +3 |
| B | Build a custom one-off connection only for this lab so the workflow can go live quickly. | +8 | +3 | -1 |
| C | Reduce scope and launch only one high-priority test package while keeping the rest on the current process. | -1 | +8 | +3 |
| D | Define a standard partner data template and onboarding pattern before connecting any new external service. | +3 | -1 | +8 |

---

#### Q5 — Product-fit: FHIR server (метрики не меняются)

- **id:** `q5-fhir-fit`
- **isProductFit:** true  
- **productBlock:** fhir
- **title:** FHIR server path
- **sceneText:** You improved parts of the journey, but the hospital still depends on a mix of local fixes, departmental workarounds, and partner-specific processes. Some improvements helped immediately, yet the underlying operating model still makes information flow harder to manage than it should be. The next step is to choose a FHIR server path that fits how your hospital needs to move forward.
- **question:** What kind of FHIR server path best fits your hospital right now?

| Вариант | Текст | productId |
|--------|--------|-----------|
| A | We need maximum control and a self-managed path our technical team can shape over time. | HAPI |
| B | We need a platform-oriented path for building new workflows and digital applications around care delivery. | Medplum |
| C | We need a path that supports faster rollout and dependable operations without unnecessary infrastructure burden. | Aidbox |
| D | We need a standards-led enterprise path with strong interoperability and governance. | Firely |

---

### Блок 2: Adaptive Medical Forms

**Вступление к блоку (blockIntro):**  
*Your hospital has already moved some intake steps into digital channels, but the experience is still uneven across clinics and patient types. Some forms are easier to launch than to maintain, and some collect information that is not easy to reuse later in the journey. The next set of decisions is about making intake more adaptable without adding complexity for staff or patients.*

---

#### Q6 — Доведение предварительного приёма до конца

- **id:** `q6`
- **title:** Tuesday, 7:40 AM
- **sceneText:** Your outpatient clinics are no longer struggling only with queues — now they are struggling with drop-off before the visit even starts. Many patients receive a long pre-visit form, open it once, and leave it unfinished. By the time they arrive, registration still has to chase missing details at the front desk. A message from the ambulatory care lead pops up: "We moved intake earlier, but we did not actually make it easier." The team wants a simpler intake experience without fragmenting the process even more.
- **question:** How do you improve pre-visit intake completion?

| Вариант | Текст | PC | SE | DR |
|--------|--------|----|----|-----|
| A | Send one short universal intake form before the visit and collect specialty details on-site. | +8 | +3 | -1 |
| B | Keep the full intake form, but have the call center help patients complete it before arrival. | +3 | -1 | +8 |
| C | Ask patients to arrive 20 minutes early and complete digital intake at kiosks in the waiting area. | -1 | +8 | +3 |
| D | Split intake into a basic pre-visit form and a second follow-up form for selected visit types. | +8 | -1 | +3 |

---

#### Q7 — Повторный ввод и фрагментация

- **id:** `q7`
- **title:** By midday
- **sceneText:** Registration is no longer drowning in paper packets, but scanned PDFs, email attachments, and half-completed digital forms still have to be reviewed and re-entered manually into downstream systems. Staff keep opening the same patient record in multiple screens just to copy data across. The front-desk supervisor writes: "We digitized the form, but not the work." The issue is no longer just form completion — it is what happens to the answers after they are submitted.
- **question:** How do you reduce re-entry and fragmented intake handling?

| Вариант | Текст | PC | SE | DR |
|--------|--------|----|----|-----|
| A | Let staff scan submitted forms into the patient record and re-enter missing details only when they become necessary. | +8 | -1 | +3 |
| B | Replace the long intake packet with a short digital check-in and keep the remaining paperwork in separate follow-up steps. | +8 | +3 | -1 |
| C | Add one intake coordinator to review incomplete submissions before patients reach the desk. | +3 | -1 | +8 |
| D | Standardize one digital intake packet for the top three clinics first and leave the rest on current processes. | +3 | +8 | -1 |

---

#### Q8 — Обновление по соответствию (compliance)

- **id:** `q8`
- **title:** Compliance update
- **sceneText:** A new compliance update lands on your desk, and every department reacts differently. Cardiology has its own form version, orthopedics has another, and surgery still uses a PDF that no one wants to touch because "it mostly works." What should be a simple change now requires multiple edits, approvals, and follow-up emails. The quality manager messages you: "We do not have one form system — we have a collection of local exceptions." The larger challenge is keeping forms aligned without forcing every clinic into exactly the same workflow.
- **question:** How do you make form updates easier across departments?

| Вариант | Текст | PC | SE | DR |
|--------|--------|----|----|-----|
| A | Let each department keep its own forms and add only one shared cover sheet for basic patient details. | +3 | +8 | -1 |
| B | Route every form change through a central governance group before anything goes live. | -1 | +3 | +8 |
| C | Freeze non-critical form changes until the next quarterly review cycle. | -1 | +8 | +3 |
| D | Create a shared question library for repeated fields, while departments keep local versions of specialty sections. | +3 | -1 | +8 |

---

#### Q9 — Pre-op и адаптивность

- **id:** `q9`
- **title:** Pre-op workflow
- **sceneText:** The final pressure point appears in a new pre-op workflow. Low-risk patients are still asked the same long checklist as complex cases, while some higher-risk cases trigger follow-up calls because staff need clarification after the form is submitted. Nurses say the process is too rigid for patients and too manual for the team. A note from the operations director appears: "Why are our digital forms still behaving like static PDFs?" The team needs a more adaptive approach, but it also needs consistency in how answers are handled across workflows.
- **question:** How do you make intake smarter for different patient scenarios?

| Вариант | Текст | PC | SE | DR |
|--------|--------|----|----|-----|
| A | Use one fixed intake form for everyone and ask nurses to follow up by phone when answers need clarification. | -1 | +3 | +8 |
| B | Shorten the form by removing less common questions and let clinicians ask the rest during the visit. | +8 | -1 | +3 |
| C | Add branching logic only to one high-volume workflow first and keep all other clinics on static forms. | +3 | +8 | -1 |
| D | Route patients to different follow-up forms based on earlier answers, with operations managing the routing rules manually. | +3 | -1 | +8 |

---

#### Q10 — Product-fit: Adaptive forms (метрики не меняются)

- **id:** `q10-forms-fit`
- **isProductFit:** true  
- **productBlock:** forms
- **title:** Adaptive forms path
- **sceneText:** You reduced some friction, but the hospital still relies on a patchwork of form versions, routing decisions, and manual follow-up. Different services need flexibility, but the system also needs a more consistent way to handle changing questions, repeated fields, and patient-specific paths. The next step is to choose an adaptive forms approach that fits how your hospital wants to operate.
- **question:** What kind of adaptive forms path best fits your hospital right now?

| Вариант | Текст | productId |
|--------|--------|-----------|
| A | We need a path focused on intake simplicity and business workflow efficiency. | Formstack |
| B | We need a developer-led path with strong control and extensibility for forms and integrations. | form.io |
| C | We need a healthcare-specific path for adaptive forms and more structured clinical data capture. | Formbox |
| D | We need an intake path tightly connected to patient communication, readiness, and pre-visit coordination. | Luma Health |

---

#### Q11 — Финальный сценарий: операционализация перед аудитом (с метриками)

- **id:** `q11-final-audit`
- **title:** Before audit review
- **sceneText:** You have chosen your FHIR server path and your adaptive forms approach. The audit is days away. Leadership wants to see that the hospital is not only technically ready but operationally ready: how data flows from intake through to the systems that auditors will review, and how staff and patients experience the new setup.
- **question:** How do you operationalize the chosen FHIR and forms approach before the audit?

| Вариант | Текст | PC | SE | DR |
|--------|--------|----|----|-----|
| A | Run a short pilot with one high-volume clinic, document lessons, then roll out to the rest before audit. | +3 | +8 | -1 |
| B | Align data flows between FHIR and forms first, then run targeted staff training and a patient-communication push. | -1 | +3 | +8 |
| C | Freeze further changes, run end-to-end checks on key journeys, and prepare a single audit-ready evidence pack. | +8 | +3 | -1 |
| D | Map every touchpoint where forms feed FHIR, fix gaps, and add a lightweight dashboard for audit visibility. | +3 | -1 | +8 |

---

## 5. Раскрытие продуктов (Product Reveal)

После выбора варианта в product-fit вопросе показывается overlay с заголовком и подзаголовком. Заголовок формируется как: **"You implemented &lt;productId&gt;"**.

### Подзаголовки (PRODUCT_REVEAL_SUBTITLES)

| productId | Subtitle |
|-----------|----------|
| HAPI | Your team chose a self-managed path with strong control. |
| Medplum | Your team chose a platform-oriented path for new workflows and apps. |
| Aidbox | Your team chose a path optimized for faster rollout and dependable operations. |
| Firely | Your team chose a standards-led enterprise path with stronger governance. |
| Formstack | Your team chose a path focused on intake simplicity and workflow efficiency. |
| form.io | Your team chose a developer-led forms path with strong control and extensibility. |
| Formbox | Your team chose a healthcare-specific adaptive forms path for structured clinical data. |
| Luma Health | Your team chose an intake path centered on communication and patient readiness. |

---

## 6. Итоговый результат (Outcome)

### 6.1 Расчёт

- **avg** = среднее арифметическое трёх метрик (patientComfort, staffEffectiveness, dataReadiness).
- **minMetric** = минимум из трёх метрик.

### 6.2 Условия исходов

| Условие | outcomeKey | Заголовок | Подзаголовок |
|---------|------------|-----------|--------------|
| avg ≥ 72 **и** minMetric ≥ 65 | smooth | Audit-Ready Hospital | You stabilized intake, improved team workflow, and connected the patient journey before audit review. |
| avg ≥ 50 **или** minMetric ≥ 40 | partial | Digitally Stabilized Hospital | You improved key parts of the hospital journey and made operations more stable before audit review. |
| иначе | fragmented | Hospital Under Pressure | The hospital still needs stronger system-wide improvements to reduce friction and manual rework. |

### 6.3 Отображение на экране Outcome

- Текст «Congratulations!», «Audit complete», «Your result:».
- Заголовок и подзаголовок по таблице выше.
- Строка: «Your FHIR path: &lt;product&gt;. Your forms path: &lt;product&gt;.» (если продукты выбраны).
- Три метрики в виде полос с процентами (Patient Comfort, Staff Comfort, Data Readiness).
- Для **smooth** при заполненном lead — блок приглашения на side event (Charité, Berlin, DMEA 2026, April 22, 6pm) с кнопкой «Register your spot».
- Кнопки шаринга (LinkedIn, Facebook, WhatsApp), копирование ссылки, скачивание карточки (html2canvas).
- Кнопка «Play again».

---

## 7. Логика потока (кратко)

1. Старт → сброс state, показ game-screen, рендер вопроса 0, привязка кнопок ответов.
2. Клик по варианту:
   - Если это product-fit (вопрос 4 или 9): сохраняем productId, показываем соответствующий overlay; метрики не меняем.
   - Иначе: вызываем `applyOptionDeltas(option)`, обновляем полоски метрик.
   - Сохраняем индекс ответа в `state.answers`.
3. После product-fit (вопрос 4): по «Continue» закрываем overlay, переходим к вопросу 5, рендерим его.
4. После product-fit (вопрос 9): по «Continue» закрываем overlay, переходим к вопросу 10 (q11-final-audit), рендерим его.
5. Для сценариев (не product-fit), кроме последнего: через 600 ms переходим к следующему вопросу (nextIndex), обновляем полоску шагов, рендерим следующий вопрос и снова привязываем кнопки.
6. После ответа на вопрос 10 (q11-final-audit): вызываем applyOptionDeltas(option), сохраняем индекс ответа, через 600 ms показываем outcome-screen и рендерим итог.

---

## 8. Сводка баллов по сценариям

Дельты только **+8**, **+3**, **-1**. Максимум баллов по одной метрике за один ответ: +8; минимум: -1. Всего 9 сценариев влияют на метрики (Q1–Q4, Q6–Q9 и Q11). Теоретический разброс по одной метрике за игру: от 25 + 9×(-1) = 16 до 25 + 9×8 = 97 (при выборе только «зелёных» вариантов по этой метрике). С учётом ограничения 0–100 итоговые значения приводятся к этому диапазону.

---

*Документ составлен по коду: `js/questions.js`, `js/state.js`, `js/metrics.js`, `js/main.js`, `js/ui.js`, `js/overlays.js`, `index.html`.*
