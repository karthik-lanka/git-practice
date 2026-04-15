import { Link } from "react-router-dom";

const pageContent = {
  "FAQ": {
    icon: "❓",
    sections: [
      { q: "How do I place an order?", a: "Browse our collections, add items to your cart, and proceed to checkout. You'll need to create an account or sign in to complete your purchase." },
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, net banking, and popular digital wallets." },
      { q: "How can I track my order?", a: "Once your order is shipped, you'll receive a tracking link via email. You can also check your order status in your Profile under 'My Orders'." },
      { q: "Can I cancel or modify my order?", a: "Orders can be cancelled or modified while in 'Pending' status. Please contact our support team for assistance." },
    ],
  },
  "Shipping Info": {
    icon: "🚚",
    sections: [
      { q: "How long does shipping take?", a: "Standard delivery takes 3-7 business days. Express delivery is available for 1-2 business days at an additional charge." },
      { q: "Is shipping free?", a: "Yes! We offer free standard shipping on all orders above ₹2,999." },
      { q: "Do you ship internationally?", a: "Currently, we ship across India. International shipping will be available soon." },
    ],
  },
  "Returns & Exchange": {
    icon: "↩️",
    sections: [
      { q: "What is your return policy?", a: "We offer a 30-day return policy on all unworn items with original tags intact." },
      { q: "How do I initiate a return?", a: "Go to My Orders in your profile, select the item, and click 'Return'. Our team will arrange a pickup." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 5-7 business days after we receive the returned item." },
    ],
  },
  "Size Guide": {
    icon: "📏",
    sections: [
      { q: "How do I find my size?", a: "Measure your chest, waist, and hips, then compare with our size chart below. When in between sizes, we recommend sizing up for a comfortable fit." },
      { q: "Size Chart", a: "XS: Chest 32-34\" | S: Chest 34-36\" | M: Chest 38-40\" | L: Chest 42-44\" | XL: Chest 46-48\" | XXL: Chest 50-52\"" },
    ],
  },
  "About Us": {
    icon: "✨",
    description: "Voguè is a premium fashion e-commerce platform dedicated to bringing you the finest curated collections. Founded with a passion for sustainable fashion, we believe that style should be timeless, accessible, and conscious. Our team handpicks every piece, ensuring quality fabrics, exceptional craftsmanship, and designs that transition effortlessly from season to season. We're committed to ethical sourcing and supporting local artisans.",
  },
  "Contact": {
    icon: "💬",
    description: "We'd love to hear from you! Reach out to our team for any queries, feedback, or support.\n\n📧 Email: support@vogue-fashion.com\n📞 Phone: +91 1800-123-4567 (Mon-Sat, 9AM-6PM)\n📍 Address: 123 Fashion Street, Mumbai, Maharashtra 400001\n\nOur support team typically responds within 24 hours.",
  },
  "Privacy Policy": {
    icon: "🔒",
    description: "At Voguè, your privacy is our priority. We collect only essential information needed to process your orders and improve your shopping experience. Your personal data is encrypted and never shared with third parties without your consent. We use cookies to enhance site functionality. You can manage your preferences at any time. For data deletion requests, please contact our support team.",
  },
  "Terms of Service": {
    icon: "📄",
    description: "By using Voguè, you agree to our terms of service. All products are subject to availability. Prices may change without notice. Users must be 18+ to create an account. We reserve the right to refuse service to anyone violating our community guidelines. Product images are for illustration purposes; actual colors may vary slightly. All intellectual property belongs to Voguè Fashion Pvt. Ltd.",
  },
};

export default function InfoPage({ title }) {
  const content = pageContent[title] || {};

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-neutral-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-neutral-600">{title}</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-4xl mb-4 block">{content.icon}</span>
        <h1 className="text-2xl md:text-3xl font-light tracking-wide">{title}</h1>
      </div>

      {/* Description content */}
      {content.description && (
        <div className="prose prose-neutral max-w-none">
          {content.description.split("\n").map((line, i) => (
            <p key={i} className="text-neutral-600 text-sm leading-relaxed mb-3">
              {line || <br />}
            </p>
          ))}
        </div>
      )}

      {/* FAQ-style sections */}
      {content.sections && (
        <div className="space-y-4">
          {content.sections.map((item, i) => (
            <div key={i} className="border border-neutral-100 rounded-xl p-5 md:p-6 hover:border-neutral-200 transition-colors">
              <h3 className="text-sm font-medium mb-2">{item.q}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      )}

      {/* Back link */}
      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
