const faqs = [
  {
    question: "Gôn Home ở được bao nhiêu người?",
    answer: "Gôn Home phù hợp tối đa 5 khách, gồm 2 phòng ngủ và không gian sinh hoạt chung.",
  },
  {
    question: "Có chỗ đậu ô tô không?",
    answer: "Có. Nhà nằm gần đường lớn dễ đi và có khu vực đậu ô tô thuận tiện.",
  },
  {
    question: "Có BBQ không?",
    answer: "Có khu vực BBQ cho gia đình hoặc nhóm bạn sử dụng trong thời gian lưu trú.",
  },
  {
    question: "Có nhận thú cưng không?",
    answer: "Hiện tại Gôn Home không nhận thú cưng để giữ không gian sạch và yên tĩnh.",
  },
  {
    question: "Có phù hợp ở dài ngày không?",
    answer: "Có. Nhà có bếp, wifi mạnh và không gian riêng tư, phù hợp làm việc online hoặc nghỉ dài ngày.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#2f241b]">Câu hỏi thường gặp</h2>
        <div className="mt-8 divide-y divide-[#e5d8c5] rounded-lg border border-[#e5d8c5]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold text-[#2f241b]">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#594536]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
