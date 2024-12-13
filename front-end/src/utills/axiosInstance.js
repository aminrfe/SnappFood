import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("access")}`,
    },
});

// Interceptor برای مدیریت پاسخ‌ها
axiosInstance.interceptors.response.use(
    (response) => response, // اگر درخواست موفق بود، پاسخ را برگرداند.
    async (error) => {
        const originalRequest = error.config;

        // بررسی وضعیت 401 (عدم احراز هویت)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // ارسال درخواست برای ریفرش توکن
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/auth/token/refresh",
                    {
                        refresh: localStorage.getItem("refresh"),
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                // ذخیره توکن جدید در localStorage
                localStorage.setItem("access", response.data.access);

                // به‌روزرسانی هدرهای Authorization
                axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.access}`;
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

                // ارسال دوباره درخواست اصلی
                return axiosInstance(originalRequest);
            } catch (err) {
                // اگر توکن ریفرش نامعتبر بود، کاربر را به صفحه ورود هدایت کنید
                console.error("Error refreshing token:", err.response?.data || err.message);
                localStorage.clear();
                window.location.href = "/login"; // تغییر مسیر به صفحه لاگین
            }
        }

        // برای سایر خطاها، پیام خطا را چاپ کنید
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Interceptor برای مدیریت درخواست‌ها
axiosInstance.interceptors.request.use(
    (config) => {
        // اضافه کردن Authorization به هر درخواست
        const token = localStorage.getItem("access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Request Error:", error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
