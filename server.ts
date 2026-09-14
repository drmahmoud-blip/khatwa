import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { INITIAL_PRODUCTS } from "./src/data/products";
import { EGYPT_GOVERNORATES } from "./src/data/governorates";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// System prompt builder with full shoe catalog knowledge
function buildSystemPrompt(language: string = "ar") {
  const productSummaries = INITIAL_PRODUCTS.map((p) => {
    return `- ID: [PRODUCT:${p.id}] | الاسم: ${p.name} (${p.nameEn}) | القسم: ${p.gender === 'men' ? 'رجالي' : 'حريمي'} | الستايل: ${p.style} | السعر الحالي: ${p.price} ج.م ${p.originalPrice ? `(قبل الخصم: ${p.originalPrice} ج.م)` : ''} | المقاسات المتاحة: [${p.sizes.join(', ')}] | الألوان: [${p.colors.map(c => c.name).join(', ')}] | الخامة: ${p.material} | المزايا: ${p.features.join('، ')}`;
  }).join("\n");

  const governoratesList = EGYPT_GOVERNORATES.slice(0, 8).map(g => `${g.nameAr} (${g.shippingCost} ج.م، ${g.deliveryDays})`).join(', ');

  return `أنت "مستشار خطوة الذكي" (Khatwa AI Shopping Advisor)، المساعد الشخصي وذراع التسوق الذكي لمتجر الأحذية المصري الفاخر "خطوة فوتوير" (KHATWA Footwear).
شعارنا: "كل خطوة ليها ستايل".

مهمتك الأساسية:
مساعدة العملاء في اختيار أفضل حذاء يناسب احتياجاتهم ومناسباتهم وميزانيتهم ومقاسهم بدقة واحترافية وود مصري راقٍ.

كتالوج المنتجات الحصري لمتجر خطوة (معرف الحذاء يوضع كـ [PRODUCT:id]):
${productSummaries}

سياسات المتجر ومميزات الشراء في مصر:
1. ميزة المعاينة قبل الدفع (Open Box Inspection): للعميل كامل الحق في فتح الكرتونة وفحص الحذاء وتجربة المقاس أمام مندوب الشحن قبل دفع أي قرش!
2. الشحن المجاني: متاح تلقائياً لأي طلب بقيمة 1,000 ج.م أو أكثر.
3. التوصيل السريع لكافة محافظات مصر: (القاهرة والجيزة 24-48 ساعة، الإسكندرية والدلتا 1-2 يوم، الصعيد 2-4 أيام). محافظات شائعة: ${governoratesList}.
4. طرق الدفع المتاحة: الدفع عند الاستلام كاش (COD)، إنستاباي InstaPay، محافظ المحمول (فودافون كاش، أورنج، اتصالات، وي)، وبطاقات الفيزا وميزة Meeza.
5. استبدال المقاس: استبدال المقاس مجاني خلال 14 يوماً.
6. كود الخصم الترحيبي: KHATWA10 (خصم 10% إضافي).

قواعد صياغة الردود:
1. أسلوب ودود ومحترف وراقٍ باللهجة المصرية المهذبة أو الفصحى المبسطة (أو الإنجليزية إذا تحدث العميل بالإنجليزية).
2. عندما تقترح حذاءً معيناً، اذكر دائماً رمزه الخاص بصيغة [PRODUCT:معرف_الحذاء] مثل [PRODUCT:kht-01] في ردك، ليقوم النظام بعرض بطاقة الحذاء التفاعلية للعميل مباشرة داخل الشات!
3. إذا سأل العميل عن مقاسه، اسأله عن مقاسه المعتاد في الأحذية الرياضية أو الكلاسيك وانصحه بمراجعة جدول القياس أو طلب المقاس المعتاد مع إمكانية تجربة الحذاء مع المندوب.
4. اقترح دائماً من حذاء إلى حذاءين بحد أقصى لتجنب تشتيت العميل، مع ذكر السبب المحدد الذي يجعل هذا الحذاء الأنسب لطلبه (مثلاً: فرش ميموري فوم للمشي الطويل، جلد طبيعي للمناسبات والبدل).
5. الردود تكون مختصرة ومركزة ومفيدة (تجنب الإطالة غير المبررة).`;
}

// AI Chatbot endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, language } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    // Use Groq API Key from environment or fallback to user-provided key
    const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";

    const systemMessage = {
      role: "system",
      content: buildSystemPrompt(language),
    };

    // Format messages for Groq OpenAI-compatible API
    const formattedMessages = [
      systemMessage,
      ...messages.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
    ];

    // Primary model: llama-3.3-70b-versatile (super fast, high intelligence, great multilingual Arabic/English)
    // Fallback: llama-3.1-8b-instant
    let response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: formattedMessages,
        temperature: 0.6,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      console.warn("Primary Groq model returned status:", response.status, "Trying fallback llama-3.1-8b-instant...");
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: formattedMessages,
          temperature: 0.6,
          max_tokens: 800,
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return res.status(500).json({ 
        error: "Groq API error", 
        details: errorText,
        fallbackReply: "أهلاً بك في متجر خطوة! يسعدني جداً مساعدتك في اختيار أفضل حذاء. ما هو نوع الحذاء الذي تبحث عنه (كلاسيك، رياضي، كاجوال، أو نسائي) وما هو مقاسك المفضل؟ 👟"
      });
    }

    const data = await response.json();
    const replyContent = data.choices?.[0]?.message?.content || "يسعدني مساعدتك في اختيار حذاءك القادم من خطوة!";

    return res.json({ reply: replyContent });
  } catch (error: any) {
    console.error("Server /api/chat error:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: error?.message,
      fallbackReply: "أهلاً بك! نوفر لك أفضل الأحذية المصنعة من الجلد الطبيعي مع ميزة المعاينة قبل الدفع. هل تفضل حذاء رياضي، كاجوال، أو كلاسيك؟" 
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
