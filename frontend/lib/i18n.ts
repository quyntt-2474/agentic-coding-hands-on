'use client';

import { useLang } from '@/components/login/language-context';

export const translations = {
  VN: {
    // Countdown
    days: 'NGÀY',
    hours: 'GIỜ',
    minutes: 'PHÚT',
    // Hero
    comingSoon: 'Comming soon',
    timeLabel: 'Thời gian:',
    venueLabel: 'Địa điểm:',
    broadcastNote: 'Tường thuật trực tiếp tại Group Facebook Sun* Family',
    aboutAwards: 'ABOUT AWARDS',
    aboutKudos: 'ABOUT KUDOS',
    // B4 section
    b4p1: 'Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI và yêu cầu ngày càng cao từ khách hàng, Sun* lựa chọn chiến lược đa dạng hóa năng lực để không chỉ nỗ lực trở thành tinh anh trong lĩnh vực của mình, mà còn hướng đến một cái đích cao hơn, nơi mọi Sunner đều là "problem-solver" - chuyên gia trong việc giải quyết mọi vấn đề, tìm lời giải cho mọi bài toán của dự án, khách hàng và xã hội.',
    b4p2: 'Lấy cảm hứng từ sự đa dạng năng lực, khả năng phát triển linh hoạt cùng tinh thần đào sâu để bứt phá trong kỷ nguyên AI, "Root Further" đã được chọn để trở thành chủ đề chính thức của Lễ trao giải Sun* Annual Awards 2025.',
    b4p3: 'Vượt ra khỏi nét nghĩa bề mặt, "Root Further" chính là hành trình chúng ta không ngừng vươn xa hơn, cắm rễ mạnh hơn, chạm đến những tầng "địa chất" ẩn sâu để tiếp tục tồn tại, vươn lên và nuôi dưỡng đam mê kiến tạo giá trị luôn cháy bỏng của người Sun*. Mượn hình ảnh bộ rễ liên tục đâm sâu vào lòng đất, mạnh mẽ len lỏi qua từng lớp "trầm tích" để thẩm thấu những gì tinh tuý nhất, người Sun* cũng đang "hấp thụ" và "tiêu hóa" chất từ thời đại và những thử thách của thị trường để làm mới mình mỗi ngày, mở rộng năng lực và mạnh mẽ "bén rễ" vào kỷ nguyên AI - một tầng "địa chất" đầy tiềm năng, phức tạp và khó đoán, nhưng cũng hội tụ vô vàn tiềm năng cùng cơ hội.',
    b4quote: '"A tree with deep roots fears no storm"',
    b4quoteSub: '(Cây sâu bền rễ, bão giông chẳng nề - Ngạn ngữ Anh)',
    b4p4: 'Trước giông bão, chỉ những tận cây có bộ rễ đủ mạnh mới có thể trụ vững. Một tổ chức với những cá nhân tự tin vào năng lực đa dạng, sẵn sàng kiến tạo và đón nhận thử thách, làm chủ sự thay đổi là tổ chức không chỉ vững vàng trước biến động, mà còn khai thác được mọi lợi thế, chinh phục các thách thức của thời cuộc. Không đơn thuần là tên gọi của chương trình mới trên hành trình phát triển tổ chức, "Root Further" còn như một lời cổ vũ, động viên mỗi người là hãy dám tin vào bản thân và xuất sắc nhất của mình. Bởi trong thời đại AI, đa dạng năng lực và tận dụng sức mạnh thời cuộc chính là điều kiện tiên quyết để trường tồn.',
    b4p5: 'Không ai biết trước ẩn sâu trong "lòng đất" của ngành công nghệ và thị trường hiện đại còn biết bao tầng "địa chất" bí ẩn. Chỉ biết rằng khi "Root Further" đã trở thành tinh thần cốt lõi, chúng ta sẽ không sợ hãi, mà càng thấy hào hứng trước bất cứ vấn đề nào trên hành trình tiến về phía trước. Vì ta luôn tin rằng, trong chính những miền vô tận đó, là bao điều kỳ diệu và cơ hội vươn mình đang chờ ta.',
    // Awards
    awardsSubtitle: 'Sun* annual awards 2025',
    awardsTitle: 'Hệ thống giải thưởng',
    topTalentTitle: 'Top Talent',
    topTalentDesc: 'Vinh danh top cá nhân xuất sắc trên mọi phương diện',
    topProjectTitle: 'Top Project',
    topProjectDesc: 'Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật',
    topProjectLeaderTitle: 'Top Project Leader',
    topProjectLeaderDesc: 'Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá',
    bestManagerTitle: 'Best Manager',
    bestManagerDesc: 'Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm',
    signatureCreatorTitle: 'Signature 2025 - Creator',
    signatureCreatorDesc: 'Vinh danh cá nhân sáng tạo nổi bật, tạo dấu ấn đặc biệt trong năm 2025',
    mvpTitle: 'MVP (Most Valuable Person)',
    mvpDesc: 'Vinh danh cá nhân có giá trị đóng góp xuất sắc nhất cho tổ chức',
    details: 'Chi tiết',
    // Kudos
    kudosTag: 'Phong trào ghi nhận',
    kudosHighlight: 'ĐIỂM MỚI CỦA SAA 2025',
    kudosDesc: 'Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được đưa ra dành cho tất cả Sunner. Heatmap và sẽ được triển khai trên nền tảng ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.',
    kudosDetails: 'Chi tiết',
    // Footer
    copyright: 'Bản quyền thuộc về Sun* © 2025',
    // Nav
    aboutSAA: 'About SAA 2025',
    awardsInfo: 'Awards Information',
    sunKudos: 'Sun* Kudos',
    generalStandards: 'Tiêu chuẩn chung',
  },
  EN: {
    // Countdown
    days: 'DAYS',
    hours: 'HOURS',
    minutes: 'MINUTES',
    // Hero
    comingSoon: 'Coming soon',
    timeLabel: 'Date:',
    venueLabel: 'Venue:',
    broadcastNote: 'Live broadcast on Sun* Family Facebook Group',
    aboutAwards: 'ABOUT AWARDS',
    aboutKudos: 'ABOUT KUDOS',
    // B4 section
    b4p1: 'Facing the rapid transformation driven by the AI era and increasingly demanding customers, Sun* has chosen a strategy of diversifying capabilities — striving not only to become elite in its own field, but also aiming higher, where every Sunner is a "problem-solver": an expert at resolving challenges and finding solutions for every project, customer, and societal problem.',
    b4p2: 'Inspired by diverse capabilities, flexible growth, and the spirit of digging deeper to break through in the AI era, "Root Further" has been chosen as the official theme of Sun* Annual Awards 2025.',
    b4p3: 'Beyond its surface meaning, "Root Further" is a journey where we constantly reach further, root deeper, and touch hidden "geological layers" below — to continue existing, growing, and nurturing the ever-burning passion for creating value that defines every Sunner. Borrowing the image of roots continuously drilling into the earth, powerfully threading through each layer of "sediment" to absorb what is most essential, Sunners are also "absorbing" and "digesting" the substance of the era and market challenges to reinvent themselves daily — expanding capabilities and powerfully "taking root" in the AI era, a "geological layer" full of potential, complexity, and unpredictability, yet converging countless opportunities for growth.',
    b4quote: '"A tree with deep roots fears no storm"',
    b4quoteSub: '(English Proverb)',
    b4p4: 'Before a storm, only trees with deep enough roots can stand firm. An organization with individuals confident in their diverse capabilities — ready to innovate, embrace challenges, and master change — is one that stands resilient against turbulence and leverages every advantage to conquer the challenges of the times. More than just a name for a new program on our organizational journey, "Root Further" is a rallying cry encouraging each person to dare believe in themselves and their most excellent self. In the AI era, diverse capabilities and harnessing the power of the times are the prerequisite for endurance.',
    b4p5: 'No one knows how many mysterious "geological layers" still lie deep within the technology industry and modern market. All we know is that when "Root Further" becomes our core spirit, we will not be afraid — we will feel excited before any challenge on our forward journey. Because we always believe that within those very boundless realms, countless wonders and opportunities for growth are waiting for us.',
    // Awards
    awardsSubtitle: 'Sun* annual awards 2025',
    awardsTitle: 'Awards System',
    topTalentTitle: 'Top Talent',
    topTalentDesc: 'Honoring top individuals excelling in every aspect',
    topProjectTitle: 'Top Project',
    topProjectDesc: 'Honoring outstanding projects with exceptional revenue performance',
    topProjectLeaderTitle: 'Top Project Leader',
    topProjectLeaderDesc: 'Honoring inspiring leaders who drive breakthrough project results',
    bestManagerTitle: 'Best Manager',
    bestManagerDesc: 'Honoring managers with excellent management and team leadership skills',
    signatureCreatorTitle: 'Signature 2025 - Creator',
    signatureCreatorDesc: 'Honoring outstanding creative individuals who made a special mark in 2025',
    mvpTitle: 'MVP (Most Valuable Person)',
    mvpDesc: 'Honoring the individual with the most outstanding contribution to the organization',
    details: 'Details',
    // Kudos
    kudosTag: 'Recognition Movement',
    kudosHighlight: 'NEW IN SAA 2025',
    kudosDesc: 'Recognition and appreciation activities for colleagues — for the first time made available to all Sunners. The activity will be deployed on the recognition platform announced by the Organizing Committee. This will serve as input for the Heads Council when selecting award recipients.',
    kudosDetails: 'Details',
    // Footer
    copyright: 'Copyright belongs to Sun* © 2025',
    // Nav
    aboutSAA: 'About SAA 2025',
    awardsInfo: 'Awards Information',
    sunKudos: 'Sun* Kudos',
    generalStandards: 'General Standards',
  },
} as const;

export type Translations = { [K in keyof typeof translations.VN]: string };

export function useTranslations(): Translations {
  const { lang } = useLang();
  return translations[lang];
}
