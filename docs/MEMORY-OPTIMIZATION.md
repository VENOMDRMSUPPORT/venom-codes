# تحسين استهلاك الرام - Venom-Codes Server

## المشكلة: الخط الأصفر في الرام ⚠️

**السبب الرئيسي**: Memory Cache (Cached + Slab) كان يستهلك **7.7GB**

| النوع | قبل التحسين | بعد التحسين |
|------|-------------|-------------|
| **Cached** | 5.7GB | 472MB |
| **Slab** | 1.7GB | 325MB |
| **buff/cache** | 7.2GB | 590MB |
| **Free** | 1.3GB | 8.0GB |

---

## التغييرات المنفذة ✅

### 1. تحسين PHP-FPM
```diff
- pm = dynamic
- pm.max_children = 20
- pm.start_servers = 5
- pm.min_spare_servers = 3
- pm.max_spare_servers = 10
- pm.max_requests = 1000

+ pm = ondemand              # تشغيل العمليات عند الحاجة فقط
+ pm.max_children = 15        # تقليل الحد الأقصى
+ pm.process_idle_timeout = 10s  # قتل العمليات الخاملة بعد 10 ثواني
+ pm.max_requests = 500       # إعادة تدوير أسرع
```

### 2. زيادة Swap Space
| قبل | بعد |
|-----|-----|
| 2GB | **8GB** |

### 3. تحسين Kernel Cache Parameters 🆕
```diff
# /etc/sysctl.d/99-cache-optimization.conf
- vm.vfs_cache_pressure = 200
+ vm.vfs_cache_pressure = 200      # إعادة تدوير dentry/inode أسرع

- vm.dirty_ratio = 20
+ vm.dirty_ratio = 10              # كتابة dirty data عند 10% بدلاً من 20%

- vm.dirty_background_ratio = 10
+ vm.dirty_background_ratio = 5    # بدء background writeback عند 5%

+ vm.dirty_expire_centisecs = 500  # كتابة dirty data بعد 5 ثواني
+ vm.dirty_writeback_centisecs = 100 # بدء writeback بعد ثانية واحدة
```

### 4. تنظيف Cache الدوري 🆕
- **سكريبت**: `/home/venom/bin/clean-cache`
- **الجدولة**: يومياً الساعة 3 AM
- **السجل**: `/home/venom/logs/cache-cleanup.log`

```bash
# تشغيل يدوي
/home/venom/bin/clean-cache

# عرض السجل
cat /home/venom/logs/cache-cleanup.log
```

---

## أسباب استهلاك الرام ⚠️

### العمليات المسببة للضغط:
1. **OpenCode AI** - 4-5 عمليات (~500MB لكل واحدة)
2. **VSCode Server** - Extension Host (~635MB)
3. **Cursor Server** - (~460MB)
4. **PHP-FPM** - 15-26 عملية (~50MB لكل واحدة)
5. **Memory Cache** - كان يستهلك 7.7GB (تم حلها الآن ✅)

### نصائح لتقليل الاستهلاك:
```bash
# إيقاف OpenCode غير المستخدم
pkill -f "opencode-ai"

# إيقاف VSCode Server إذا لم تستخدمه
pkill -f "vscode-server"

# إيقاف Cursor Server إذا لم تستخدمه
pkill -f "cursor-server"

# تنظيف cache يدوياً
/home/venom/bin/clean-cache
```

---

## مراقبة الرام 🔍

```bash
# فحص سريع
/home/venom/bin/memory-monitor check

# مراقبة مستمرة (تحديث كل 5 ثواني)
/home/venom/bin/memory-monitor watch
```

### التفسير:
- 🟢 **أخضر**: استهلاك طبيعي (< 70%)
- 🟡 **أصفر**: تحذير (> 70%)
- 🔴 **أحمر**: حرج (> 85%) - سيظهر لك أعلى المستهلكين

---

## إدارة الخدمات 🚀

```bash
# إعادة تشغيل PHP-FPM
pkill -f php-fpm && /home/venom/bin/php-fpm -g /home/venom/php/var/run/php-fpm.pid -c /home/venom/php/etc/php.ini

# فحص حالة الخدمات
/home/venom/service status
```

---

## النتائج المتوقعة 📈

| التحسين | التأثير |
|---------|---------|
| PHP-FPM ondemand | تقليل 20-30% من استهلاك PHP-FPM |
| Swap 8GB | منع وصول الرام لـ100% عند الضغط |
| Cache optimization | منع تراكم cache (كان 7.7GB) |
| Daily cache cleanup | تنظيف دوري كل 24 ساعة |

---

## للصيانة المستقبلية

1. راقب استهلاك الرام أسبوعياً: `/home/venom/bin/memory-monitor check`
2. أوقف عمليات التطوير غير المستخدمة (OpenCode, VSCode)
3. تحقق من سجل التنظيف: `cat /home/venom/logs/cache-cleanup.log`
4. وثق أي تغييرات في [INFRASTRUCTURE.md](./INFRASTRUCTURE.md)

---

## الملفات المعدلة

| الملف | الغرض |
|------|--------|
| `/home/venom/php/etc/pools.d/BfY5hK.conf` | PHP-FPM pool config |
| `/etc/sysctl.d/99-cache-optimization.conf` | Kernel cache params |
| `/home/venom/bin/clean-cache` | Cache cleanup script |
| `/etc/sudoers.d/cache-cleanup` | Sudo permission for cleanup |
| Crontab | Daily 3 AM cleanup job |
