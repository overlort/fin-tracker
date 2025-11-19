# Деплой и обновление приложения

## 1. Процесс обновления PWA

### Как это работает:

1. Вы вносите изменения в код
2. Собираете новую версию: `npm run build`
3. Деплоите на хостинг (заменяете старые файлы новыми)
4. Service Worker автоматически обнаружит новую версию
5. Пользователи получат обновление при следующем открытии приложения

### Важно: Service Worker и кеширование

Сейчас в `service-worker.js` используется фиксированная версия кеша:
```javascript
const CACHE_NAME = 'fin-tracker-v1';
```

**При обновлении нужно менять версию**, чтобы старый кеш удалился и загрузился новый.

## 2. Варианты хостинга для продакшена

### Бесплатные варианты:

#### Vercel
- Подключите GitHub репозиторий
- Автоматический деплой при каждом push
- HTTPS включен по умолчанию
- Команда: `npm install -g vercel && vercel`

#### Netlify
- Аналогично Vercel
- Drag & drop папки `build`
- Или через Git
- Команда: `npm install -g netlify-cli && netlify deploy`

#### GitHub Pages
- Бесплатно для публичных репозиториев
- Нужно настроить GitHub Actions для автоматического деплоя

#### Firebase Hosting
- Бесплатный тариф
- Команда: `npm install -g firebase-tools && firebase init hosting`

#### Cloudflare Pages
- Бесплатно с хорошими возможностями
- Автоматический деплой из Git

### Платные варианты:

- **VPS** (DigitalOcean, AWS, etc.) - полный контроль
- **Собственный сервер** - максимальная гибкость

## 3. Рекомендуемый процесс разработки

### Локальная разработка:
```bash
npm start  # Запуск dev-сервера
```

### Тестирование продакшен-сборки локально:
```bash
npm run build
npx http-server -p 3000 -a YOUR_IP_ADDRESS
```

### Деплой на продакшен:
```bash
npm run build
# Затем загрузите папку build на хостинг
```

## 4. Улучшение Service Worker для обновлений

Чтобы обновления работали корректно, нужно:

1. **Менять версию кеша при каждом обновлении**
2. Использовать стратегию обновления (например, "stale-while-revalidate")
3. Уведомлять пользователей о доступных обновлениях

### Пример улучшенного Service Worker:

```javascript
// Версию можно генерировать автоматически или менять вручную
const CACHE_NAME = 'fin-tracker-v2'; // Меняйте при каждом обновлении

// При активации удаляем старые кеши
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
```

### Автоматическое версионирование кеша

Можно использовать дату или версию из package.json:

```javascript
// Вариант 1: По дате
const CACHE_NAME = `fin-tracker-${new Date().getTime()}`;

// Вариант 2: По версии из package.json (нужно подключить через build)
const CACHE_NAME = 'fin-tracker-v1.0.1';
```

## 5. Автоматизация деплоя (CI/CD)

### Пример с GitHub Actions (для Vercel/Netlify):

1. Push в GitHub → автоматический деплой
2. Каждое изменение сразу попадает на продакшен

### Пример workflow для GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm install -g vercel
      - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### Настройка Vercel через CLI:

```bash
# Установка
npm install -g vercel

# Первый деплой (интерактивная настройка)
vercel

# Продакшен деплой
vercel --prod
```

### Настройка Netlify через CLI:

```bash
# Установка
npm install -g netlify-cli

# Первый деплой (интерактивная настройка)
netlify deploy

# Продакшен деплой
netlify deploy --prod
```

## 6. Уведомление пользователей об обновлениях

Можно добавить уведомление о новой версии:

```javascript
// В index.tsx после регистрации Service Worker
navigator.serviceWorker.addEventListener('controllerchange', () => {
  // Показать уведомление пользователю
  if (confirm('Доступна новая версия приложения! Перезагрузить страницу?')) {
    window.location.reload();
  }
});

// Или проверка обновлений при загрузке
window.addEventListener('load', () => {
  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Новый Service Worker установлен, можно уведомить пользователя
          console.log('Новая версия доступна!');
        }
      });
    });
  });
});
```

## 7. Рекомендации

### Для начала:

1. **Используйте Vercel или Netlify** (бесплатно, HTTPS, простой деплой)
2. Подключите GitHub репозиторий
3. Настройте автоматический деплой при push в `main`

### Процесс работы:

- Вы делаете изменения
- `git push`
- Через 1-2 минуты обновление на продакшене
- Пользователи получают новую версию при следующем открытии

### Важные моменты:

1. **Всегда тестируйте сборку локально** перед деплоем
2. **Меняйте версию кеша** в Service Worker при каждом обновлении
3. **Используйте HTTPS** для продакшена (обязательно для PWA)
4. **Версионируйте релизы** (можно использовать git tags)

## 8. Проверка обновлений

### Как проверить, что обновление работает:

1. Откройте DevTools → Application → Service Workers
2. Проверьте статус Service Worker
3. Обновите страницу (Ctrl+Shift+R для жесткой перезагрузки)
4. Проверьте, что новая версия кеша загрузилась

### Отладка Service Worker:

```javascript
// В консоли браузера
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => {
    console.log('Service Worker:', registration);
  });
});
```

## 9. Откат к предыдущей версии

Если что-то пошло не так:

1. Откатите изменения в Git
2. Сделайте новый деплой
3. Или вручную загрузите предыдущую версию из `build` папки

### В Vercel/Netlify:

- Можно откатиться к предыдущему деплою через веб-интерфейс
- Или через CLI: `vercel rollback` / `netlify deploy --prod --dir=build`

