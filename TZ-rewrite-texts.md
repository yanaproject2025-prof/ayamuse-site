# ТЗ для Cowork — переписать тексты сайта ayamuse.com

**Версия:** 2026-05-26 (после согласования с Ингой)
**Автор:** Inga (с Claude и доработками ChatGPT)
**Статус:** часть применена, часть ждёт пилота

---

## Что уже сделано в коммите от 2026-05-26

Этот коммит покрывает **SEO-каркас и юридическую отстройку**. Большой переписывание body-текстов идёт следующим этапом — с таблицей «было → стало» под утверждение.

### ✅ Применено в этом коммите

1. **Title и meta description** обновлены на 6 страницах (короткие, ≤60 символов, под новую территорию ключей).
2. **«Aya Muse Brandbook»** в Atelier переименован в **«House of Aya — Brandbook Case»** (h2 + aria-label).
3. **Apps** добавлены в позиционирование Atelier (hero subtitle, intro, teaser на главной) — больше не «app concepts», а полноценная услуга.

### Финальный комплект title (применён)

| Страница | Title | Символов |
|---|---|---|
| index | `Aya Muse World — A Sanctuary for Soft Living & Inner Beauty` | 60 |
| atelier | `Aya Boutique Digital Atelier — Websites, Apps & Brandbooks` | 57 |
| collaborations | `Brand Worlds for Beauty & Wellness — Aya Muse World` | 51 |
| travel | `Journeys with Aya — Travel by Emotion` | 37 |
| letter | `Letters from Aya — Soft Reflections` | 35 |
| news | `News — Aya Muse World` (без изменений) | 21 |
| support | `Contact & Support — Aya Muse World` (без изменений в title, обновлён meta) | 35 |

### Финальные meta description (применены)

- **index:** `A sanctuary for soft living and inner beauty. Letters, rituals, travel and a future palace — built for women returning to themselves.`
- **atelier:** `Boutique websites, mobile apps and brandbooks crafted with editorial taste — by the team behind the Aya app. Soft luxury digital worlds for brands with soul.`
- **collaborations:** `Brand worlds for beauty, fragrance, wellness, hotels and travel — collaborations that create atmosphere, not advertising. By Aya Muse World.`
- **travel:** `Travel curated by emotion, not destination. Calm escapes, soft luxury retreats and quiet places to return to yourself — with Aya Muse World.`
- **letter:** `Soft reflections, founder notes and quiet guidance — letters written from the heart of Aya Muse World.`
- **support:** `Reach Aya Muse World for general questions, atelier inquiries, brand collaborations and partnerships. Quiet, attentive, and personal.`

---

## Что осталось на следующий этап (пилот: главная + Atelier + Collaborations)

### 1. Переписать body-тексты под человечность

Применить правила «анти-ИИ» к ключевым страницам. **Запрещённые конструкции** (найдены на текущем сайте, не общая теория):

- Формула «There are X. There are Y. Z is the second kind.» — повторена 5 раз на travel. Оставить максимум один раз.
- Тройки/четвёрки прилагательных подряд: «soft, luminous, like the first morning light»; «calm, grounded, warm, body-focused». Одно точное слово сильнее трёх.
- Фраза «want to be felt, not only seen» сейчас встречается на 3 страницах. **Оставить только в одном месте** (рекомендую: collaborations).
- «Not just X — but Y» / «Not only X but Y» — сейчас около 8 раз. Оставить 1–2.
- Слово «atmosphere/atmospheric» в каждом абзаце — сократить **втрое**.
- «Cinematic» на travel — сократить вдвое.
- Заштампованные глаголы: elevate, unlock, seamless, dive in, transform, navigate.
- Обороты: «in today's world», «take it to the next level», «whether you're… or…», «more than just».

**Правила вместо них:**

- Чередовать длину фраз. После длинной — короткая. Это даёт дыхание.
- Конкретный образ вместо абстракции. Не «emotional support» → а «a lamp left on for you».
- Айя говорит от первого лица где уместно («I», «we»). Сейчас почти везде безличное.
- Чуть-чуть несовершенства допустимо — живой текст не идеально гладкий.
- **Принцип ChatGPT (правильный):** «не делать текст проще. Сделать его менее гладким».

### 2. Anti-fashion отстройка в body

- Везде **полное** имя `Aya Muse World`, никогда `Aya Muse` отдельно.
- **Запрещённая fashion-лексика:** dress, dresses, wardrobe, outfit, garments, knitwear, ready-to-wear, runway, sizing, "shop the look", silhouette в значении одежды, tailoring.
- **Контекстно избегать:** «collection» в значении «коллекция одежды» (если про наши digital продукты — заменить на *world, edition, ritual set, chapter, series*); «editorial» — точечно, не везде; «moodboard», «styling» — заменители: *visual world, atmosphere, scene*.

### 3. Anti-medical guardrails (важно)

Бренд **не медицинский** — никаких клинических утверждений.

- Слово **«healing»** — оставляем в body как часть tagline «Healing through style» (это ДНК бренда из письма Founder). Контекст «through style» однозначно эмоциональный.
- **Запрещённые клинические слова:** therapy, treatment, diagnose, cure, medical, clinical, anxiety disorder, depression.
- **Можно:** emotional support, soft companion, gentle reflection, mindful moments, inner peace, women's wellbeing, soft living.
- В SEO title и meta — слово «healing» **не используем в одиночку** (без контекста). Поэтому в title главной выбрано «Inner Beauty», а не «Healing» (применено в этом коммите).
- **Обязательно до релиза app в сторах:** добавить дисклеймер в `legal-app-en.html` / `legal-app-ru.html` и/или footer:
  > *Aya is not a substitute for therapy, medical advice, or professional mental health support. If you are in crisis, please contact a licensed professional or emergency services.*

### 4. Опциональная anti-fashion фраза-разделитель

Вставить **один раз** в Letter (не в hero главной — это будет звучать защитно). Лучший вариант (ChatGPT):

> *Aya Muse World was never made to dress the body. It was made to hold the inner life.*

### 5. JSON-файлы — обязательная часть скоупа

Часть текстов грузится из JSON. Переписывать одновременно с HTML:

- `modules/collaborations/collaborations.json` — главный текст страницы.
- `modules/atelier/projects.json` — описания VAIA, Aya Maison и т.д. (поля `world`, `mood`, `description`).
- `modules/letter/pinned.json` — Message from the Founder (**почти не трогать**, это самый живой текст на сайте, образец человечности).
- `modules/letter/latest.json` + `posts/` — письма.
- `modules/news/news.json` — карточки новостей.
- `modules/collections/collections.json` — карточки.
- `modules/future/future.json` — Aya App, Aya Palace. Переписать как **«одна история, две формы»**: digital сейчас, физический позже. Не «два разных продукта».

### 6. Per-page SEO purpose

- **Главная** — объяснить, что такое Aya Muse World как sanctuary в любой форме (app, palace, retreats).
- **Atelier** — привести клиентов на сайты / приложения / брендбуки / AI-визуалы. Использовать собственный готовый app как proof point.
- **Collaborations** — привести бренды beauty / wellness / fragrance / hotels / travel.
- **Travel** — трафик по soft luxury / emotional travel / destination mood.
- **Letters** — живой голос Айи + индексируемые тексты + место для anti-fashion разделительной фразы.

---

## ⛔ Железные ограничения для следующего этапа

- Не менять структуру страниц, вёрстку, блоки, порядок секций.
- Не трогать CSS, классы, стили, шрифты, цвета, отступы, анимации.
- Не трогать JavaScript, Firebase-логику, формы.
- Не добавлять и не удалять страницы, кнопки, разделы.
- Не менять URL.
- **Навигацию в шапке не трогать** — `Letter / Travel / Atelier / Collections / Collaborations / Support` остаётся как есть. «Collections» в `Worlds` не переименовываем (UX-цена выше выгоды).
- Менять только текстовое содержимое в существующих элементах + текстовые значения в JSON (`title`, `excerpt`, `description`, `paragraphs`, `list`, `eyebrow`, `mood`, `world` — но не ключи и не URL).

Если правка затрагивает что-то кроме текста — вынести в «спорные места», не делать.

---

## 📦 Формат сдачи следующего этапа

1. **Таблица «было → стало»** по каждому изменённому фрагменту (страница → элемент/JSON path → было → стало).
2. **Список «спорные места»** — где правка затрагивает не только текст.
3. **Резервная копия** перед правками (origin/main на GitHub уже является backup'ом).
4. **Ничего не публиковать без «ок» Инги** — все правки в локальной копии, утверждается через таблицу.

---

## Чек-лист для самопроверки следующего этапа

- [ ] Везде полное **Aya Muse World**, нет одинокого «Aya Muse».
- [x] «Aya Muse Brandbook» → «House of Aya — Brandbook Case» (сделано).
- [x] Apps добавлены в позиционирование Atelier (сделано).
- [x] SEO title и meta обновлены (сделано).
- [ ] Запрещённые fashion-слова отсутствуют.
- [ ] Запрещённые клинические слова отсутствуют.
- [ ] Формула «There are X. There are Y.» оставлена максимум в одном месте.
- [ ] «Want to be felt, not only seen» — только в одном месте.
- [ ] Слово «atmosphere/atmospheric» — сокращено минимум втрое.
- [ ] Длина фраз чередуется, нет «метронома».
- [ ] JSON-файлы переписаны вместе с HTML.
- [ ] Anti-fashion фраза-разделитель вставлена один раз (Letter).
- [ ] Медицинский дисклеймер добавлен в legal-app-en.html / legal-app-ru.html / footer.
- [ ] Таблица «было → стало» подготовлена.
- [ ] CSS, JS, классы, URL, структура — не тронуты.
