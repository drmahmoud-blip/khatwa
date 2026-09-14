import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShoppingBag, 
  ChevronDown, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Truck,
  Check
} from 'lucide-react';
import { Product, Language, ProductColor } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIChatAdvisorProps {
  language: Language;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number, color: ProductColor) => void;
  onOpenSizeGuide: () => void;
  onOpenTrackOrder: () => void;
}

export const AIChatAdvisor: React.FC<AIChatAdvisorProps> = ({
  language,
  products,
  onSelectProduct,
  onAddToCart,
  onOpenSizeGuide,
  onOpenTrackOrder,
}) => {
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: isAr
          ? 'أهلاً بك في متجر خطوة! 👟 أنا مستشارك الذكي، هنا لمساعدتك في اختيار الحذاء الأنسب لمناسبتك ومقاسك وميزانيتك. كيف يمكنني مساعدتك اليوم؟'
          : 'Welcome to KHATWA Footwear! 👟 I am your AI Shopping Advisor, here to help you find the best shoe for your style, size, and budget. How can I assist you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNewPrompt, setHasNewPrompt] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = isAr
    ? [
        { label: '👔 حذاء كلاسيك للمناسبات والبدل', prompt: 'عاوز ترشيح لحذاء كلاسيك فاخر للمناسبات والبدل' },
        { label: '🏃‍♂️ أفضل سنيكرز للمشي والجيم', prompt: 'رشح لي أفضل حذاء رياضي مريح للجيم والمشي اليومي' },
        { label: '👠 حذاء حريمي مريح وعصري', prompt: 'ما هي أفضل الأحذية الحريمي المريحة للخروج والعمل؟' },
        { label: '📏 إزاي اختار مقاسي المظبوط؟', prompt: 'كيف اختار مقاسي المناسب في أحذية خطوة؟' },
        { label: '🛡️ ما هي ميزة المعاينة قبل الدفع؟', prompt: 'اشرح لي ميزة المعاينة قبل الدفع والشحن في مصر' },
      ]
    : [
        { label: '👔 Classic shoes for formal suits', prompt: 'Recommend the best classic dress shoe for formal suits' },
        { label: '🏃‍♂️ Best sneakers for gym & walking', prompt: 'What are the best sneakers for walking and workouts?' },
        { label: '👠 Comfortable women\'s shoes', prompt: 'Show me comfortable footwear for women' },
        { label: '📏 How do I pick my size?', prompt: 'How do I choose my exact shoe size?' },
        { label: '🛡️ Open-box inspection guarantee', prompt: 'How does open-box inspection work in Egypt?' },
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewPrompt(false);
    }
  }, [messages, isOpen]);

  // Handle local fallback recommendations if server/API is unreachable
  const generateFallbackResponse = (userText: string) => {
    const lower = userText.toLowerCase();
    
    if (lower.includes('كلاسيك') || lower.includes('بدل') || lower.includes('مناسب') || lower.includes('classic') || lower.includes('suit')) {
      return `أنصحك جداً بحذاء **أكسفورد رويال كلاسيك** [PRODUCT:kht-02]! مصنوع من جلد طبيعي مصري فاخر ومبطن بنعل طبي يدعم القدم طوال اليوم، وهو الخيار الأمثل للبدل والاجتماعات الرسمية. متوفر بمقاسات من 40 إلى 45.`;
    }
    
    if (lower.includes('رياضي') || lower.includes('جيم') || lower.includes('جري') || lower.includes('ركض') || lower.includes('sport') || lower.includes('gym') || lower.includes('run')) {
      return `خيارك الأفضل هو **حذاء ركض وجيم أكتيف برو ماكس** [PRODUCT:kht-06]! يتميز بنعل ممتص للصدمات ونسيج شبكي فائق التهوية يناسب التمارين الشاقة والمشي الطويل.`;
    }

    if (lower.includes('حريم') || lower.includes('بنات') || lower.includes('ستات') || lower.includes('women') || lower.includes('ladies')) {
      return `لحضور أنيق ومريح في العمل والخروجات، أرشح لكِ **سنيكرز إيليجانت أوربان للنساء** [PRODUCT:kht-05] أو **لوفر كلاسيكي ناعم للنساء** [PRODUCT:kht-08] بالجلد الإيطالي الطري!`;
    }

    if (lower.includes('مقاس') || lower.includes('size') || lower.includes('قياس')) {
      return `جميع أحذيتنا تأتي بمقاسات قياسية مصرية دقيقة (True to Size). ننصحك بطلب مقاسك المعتاد في الأحذية، وتذكر دائماً أنه يمكنك تجربة المقاس بحرية أمام مندوب التوصيل قبل دفع أي مبالغ! 📏`;
    }

    if (lower.includes('معاين') || lower.includes('شحن') || lower.includes('دفع') || lower.includes('inspect') || lower.includes('shipping')) {
      return `في خطوة، نوفر لك ميزة **المعاينة قبل الدفع**! عند وصول مندوب الشحن يمكنك فتح العلبة وتجربة الحذاء والتأكد من المقاس والخامة قبل السداد. كما أن الشحن مجاني لأي طلب بقيمة 1,000 ج.م أو أكثر 🚚.`;
    }

    // Default recommendation
    return `بناءً على طلبك، أرشح لك حذاء **خطوة ألترا كومفورت كاجوال** [PRODUCT:kht-01]، الحذاء الأكثر مبيعاً وتقييماً (4.9/5) بفرش ميموري فوم ونعل مرن مريح طوال اليوم! كما يمكنك تجربة مقاسك بكل سهولة مع المندوب.`;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          language,
        }),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();
      const reply = data.reply || data.fallbackReply || generateFallbackResponse(query);

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.warn('Chat request failed, using intelligent local advisor fallback:', err);
      const fallback = generateFallbackResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          role: 'assistant',
          content: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: isAr
          ? 'تم بدء محادثة جديدة! ما هو نوع الحذاء أو المقاس الذي تبحث عنه؟ 👟'
          : 'Started a fresh session! What shoe style or size are you looking for? 👟',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Parses [PRODUCT:kht-01] mentions in text and replaces with interactive card
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\[PRODUCT:[a-zA-Z0-9_-]+\])/g);

    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
        {parts.map((part, index) => {
          const match = part.match(/\[PRODUCT:([a-zA-Z0-9_-]+)\]/);
          if (match) {
            const productId = match[1];
            const product = products.find((p) => p.id === productId);
            if (!product) return null;

            return (
              <div
                key={`prod-${index}`}
                className="my-2.5 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] shadow-xs flex items-center gap-3 hover:border-[#C5A059] transition-all"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-[#E0D7C9] bg-white shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#8B5A2B] uppercase block">
                    {product.style} • {product.gender === 'men' ? 'رجالي' : 'حريمي'}
                  </span>
                  <h5 className="font-black text-xs sm:text-sm text-[#1A1A1A] truncate">
                    {isAr ? product.name : product.nameEn}
                  </h5>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-black text-xs text-[#1C140E]">
                      {product.price.toLocaleString()} {t.egp}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-[#8A7A6E] line-through">
                        {product.originalPrice.toLocaleString()} {t.egp}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-2.5 py-1 rounded-lg bg-[#2C1D11] text-[#FAF8F5] text-[11px] font-bold hover:bg-[#3D2817] transition-all"
                    >
                      عرض التفاصيل
                    </button>
                    <button
                      onClick={() => onAddToCart(product, product.sizes[0], product.colors[0])}
                      className="px-2.5 py-1 rounded-lg bg-[#C5A059] text-[#121212] text-[11px] font-bold hover:bg-[#B38F48] transition-all flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>أضف للسلة</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // Regular text rendering with basic markdown bold support
          const textWithBold = part.split(/(\*\*.*?\*\*)/g).map((sub, i) => {
            if (sub.startsWith('**') && sub.endsWith('**')) {
              return <strong key={i} className="font-black text-[#1A1A1A]">{sub.slice(2, -2)}</strong>;
            }
            return sub;
          });

          return <span key={index}>{textWithBold}</span>;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-20 lg:bottom-6 left-4 sm:left-6 z-40 flex flex-col items-start gap-2">
        {/* Helper preview bubble when closed */}
        {!isOpen && hasNewPrompt && (
          <div 
            onClick={() => setIsOpen(true)}
            className="cursor-pointer bg-white px-3.5 py-2 rounded-2xl shadow-xl border border-[#E8E1D5] text-xs font-bold text-[#2C1D11] flex items-center gap-2 animate-bounce max-w-[220px]"
          >
            <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span className="truncate">
              {isAr ? 'محتار تختار؟ اسأل مستشار خطوة 👟' : 'Need shoe advice? Ask AI 👟'}
            </span>
          </div>
        )}

        <button
          id="open-ai-chat-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#2C1D11] to-[#121212] text-[#FAF8F5] shadow-2xl border border-[#C5A059]/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          title={isAr ? 'مستشار خطوة الذكي' : 'AI Shopping Advisor'}
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-[#C5A059]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#2C1D11] animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#2C1D11]" />
          </div>

          <span className="hidden md:inline font-black text-xs tracking-wide">
            {isAr ? 'مستشار خطوة الذكي' : 'AI Advisor'}
          </span>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div 
          id="ai-chat-window"
          className="fixed bottom-24 lg:bottom-6 left-2 sm:left-6 z-50 w-[95vw] sm:w-[420px] max-w-full h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#E8E1D5] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#2C1D11] to-[#1F140C] text-white flex items-center justify-between border-b border-[#C5A059]/30">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-[#121212] flex items-center justify-center font-black shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm text-white">
                    {isAr ? 'مستشار خطوة الذكي' : 'Khatwa AI Advisor'}
                  </h4>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    نشط الآن
                  </span>
                </div>
                <p className="text-[11px] text-[#C5A059]">
                  {isAr ? 'مدعوم بكتالوج خطوة وحق المعاينة' : 'Smart shoe recommendations'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-[#C8B8AA] hover:text-white hover:bg-white/10 transition-colors"
                title={isAr ? 'بدء محادثة جديدة' : 'Reset chat'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#C8B8AA] hover:text-white hover:bg-white/10 transition-colors"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Trust Banner inside Chat */}
          <div className="bg-[#FAF5ED] px-3.5 py-1.5 border-b border-[#E8E1D5] flex items-center justify-between text-[11px] text-[#5C4D42]">
            <span className="flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>معاينة وقياس مع المندوب قبل الدفع</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#8B5A2B]">
              <Truck className="w-3 h-3 text-[#C5A059]" />
              <span>شحن سريع لمحافظات مصر</span>
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F5]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#2C1D11] text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-[#2C1D11] text-[#FAF8F5] rounded-te-none'
                      : 'bg-white text-[#2C1D11] border border-[#E8E1D5] rounded-ts-none'
                  }`}
                >
                  {renderMessageContent(msg.content)}
                  <div
                    className={`text-[9px] mt-1.5 text-end ${
                      msg.role === 'user' ? 'text-white/60' : 'text-[#8A7A6E]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#C5A059] text-[#121212] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#2C1D11] text-[#C5A059] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-[#E8E1D5] rounded-2xl rounded-ts-none p-3 shadow-xs flex items-center gap-1.5">
                  <span className="text-xs text-[#8A7A6E]">جاري التفكير وترشيح الأنسب لك...</span>
                  <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2.5 bg-white border-t border-[#E8E1D5] overflow-x-auto no-scrollbar flex gap-1.5">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSend(item.prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#FAF5ED] border border-[#E0D7C9] hover:border-[#C5A059] text-[11px] font-bold text-[#2C1D11] transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#E8E1D5] flex gap-2 items-center"
          >
            <input
              id="ai-chat-input"
              type="text"
              placeholder={isAr ? 'اسأل عن المقاس، الموديل، أو المناسبة...' : 'Ask about shoes, sizes, styles...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl py-2.5 px-3 text-xs text-[#1A1A1A] placeholder-[#8A7A6E] focus:outline-hidden focus:border-[#C5A059]"
            />
            <button
              id="ai-chat-send-btn"
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-[#2C1D11] hover:bg-[#3D2817] text-[#FAF8F5] flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 text-[#C5A059] rtl:-scale-x-100" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
