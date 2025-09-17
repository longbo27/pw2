// 联系表单处理 - 多种邮件发送方式
class ContactFormHandler {
  constructor() {
    this.form = document.querySelector(".contact-form form");
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = this.getFormData();

    // 验证表单
    if (!this.validateForm(formData)) {
      return;
    }

    // 显示加载状态
    this.showLoading(true);

    try {
      // 尝试多种发送方式
      await this.sendEmail(formData);
      this.showSuccess();
      this.form.reset();
    } catch (error) {
      console.error("Email sending failed:", error);
      this.showError(error.message);
    } finally {
      this.showLoading(false);
    }
  }

  getFormData() {
    return {
      name: this.form.querySelector('input[type="text"]').value,
      email: this.form.querySelector('input[type="email"]').value,
      subject: this.form.querySelectorAll('input[type="text"]')[1].value,
      message: this.form.querySelector("textarea").value,
    };
  }

  validateForm(data) {
    if (!data.name || !data.email || !data.subject || !data.message) {
      const errorMsg =
        languageManager.currentLang === "zh"
          ? "请填写所有必填字段"
          : "Please fill in all required fields";
      this.showError(errorMsg);
      return false;
    }

    if (!this.isValidEmail(data.email)) {
      const errorMsg =
        languageManager.currentLang === "zh"
          ? "请输入有效的邮箱地址"
          : "Please enter a valid email address";
      this.showError(errorMsg);
      return false;
    }

    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async sendEmail(data) {
    // 方法1: 使用 EmailJS (推荐)
    if (typeof emailjs !== "undefined") {
      return await this.sendWithEmailJS(data);
    }

    // 方法2: 使用 Formspree
    return await this.sendWithFormspree(data);
  }

  async sendWithEmailJS(data) {
    // 需要配置 EmailJS
    const serviceID = "YOUR_SERVICE_ID";
    const templateID = "YOUR_TEMPLATE_ID";
    const publicKey = "YOUR_PUBLIC_KEY";

    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
      to_email: "xian@longbo.cloud",
    };

    return await emailjs.send(serviceID, templateID, templateParams, publicKey);
  }

  async sendWithFormspree(data) {
    // 使用 Formspree 服务
    const formspreeEndpoint = "https://formspree.io/f/YOUR_FORM_ID";

    const response = await fetch(formspreeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        _replyto: data.email,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    return response;
  }

  showLoading(show) {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    if (show) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        languageManager.currentLang === "zh" ? "发送中..." : "Sending...";
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        languageManager.currentLang === "zh" ? "发送消息" : "Send Message";
    }
  }

  showSuccess() {
    const successMsg =
      languageManager.currentLang === "zh"
        ? "消息发送成功！我会尽快回复您。"
        : "Message sent successfully! I will reply to you as soon as possible.";
    this.showNotification(successMsg, "success");
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === "success" ? "#00d4ff" : "#ff4444"};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// 初始化联系表单处理器
document.addEventListener("DOMContentLoaded", () => {
  new ContactFormHandler();
});
