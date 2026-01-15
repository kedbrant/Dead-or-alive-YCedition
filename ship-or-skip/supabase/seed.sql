-- Seed data: Real startups from TrustMRR
-- Source: https://trustmrr.com (verified revenue data)
-- Avatar service: https://unavatar.io/twitter/{handle}

INSERT INTO ideas (slug, hero, subtitle, source, source_company, source_outcome, submitter_twitter, link) VALUES

-- $1M+ Revenue Tier
('rezi',
 'AI resume builder optimized for applicant tracking systems',
 'Leading resume platform serving ~1M new users annually. Supports 300+ organizations including Fortune 500 companies.',
 'trustmrr', 'Rezi', '$8M+ revenue', 'jacob_jacquet', 'https://www.rezi.ai'),

('editee-com',
 'AI-powered marketing team that creates content 10x faster',
 'Czech AI content creation tool that automates marketing content including sales texts, emails, graphics, and social posts.',
 'trustmrr', 'Editee.com', '$7M+ revenue', 'stepanhlinka', 'https://editee.com'),

('agentgpt',
 'Deploy AI agents directly from your browser - no coding required',
 'Platform enabling users to create and deploy language model agents without coding, designed for business automation.',
 'trustmrr', 'AgentGPT', '$1M+ revenue', 'asimdotshrestha', 'https://agentgpt.reworkd.ai'),

('seobot',
 'AI agent that writes SEO-optimized blog posts while you sleep',
 'AI Agent for SEO - handles keywords, research, blog posts, mini apps, and programmatic SEO automatically.',
 'trustmrr', 'SEOBOT', '$1M+ revenue', 'johnrushx', 'https://seobotai.com'),

('shipfast',
 'Ship your startup in days, not months',
 'NextJS boilerplate with everything needed to build SaaS, AI tools, or web apps and achieve first revenue quickly.',
 'trustmrr', 'ShipFast', '$1M+ revenue', 'marclou', 'https://shipfa.st'),

('based-labs-ai',
 'Create AI images, videos, and audio with your team',
 'BasedLabs lets you and your team imagine and create anything with AI. Brainstorm and generate content together.',
 'trustmrr', 'Based Labs AI', '$1M+ revenue', 'michaelaubry', 'https://www.basedlabs.ai'),

('vidai',
 'Turn any script into a ready-to-post video with AI',
 'AI generates voiceovers, visuals, and edits automatically. Transform ideas into videos that get views.',
 'trustmrr', 'Vid.AI', '$1M+ revenue', 'priymrj', 'https://vid.ai'),

('1capture',
 'Double your trial-to-paid conversion without changing your product',
 'Smart payment capture and AI optimization that reduces trial-to-paid conversion drop-off and involuntary churn.',
 'trustmrr', '1Capture', '$2M+ revenue', 'RobbyFrank', 'https://www.1capture.io'),

('aeo-engine',
 'AI agents that optimize your content for Google and ChatGPT',
 'A living network of AI agents working in sync to expand visibility across Google, ChatGPT, and Perplexity.',
 'trustmrr', 'AEO Engine', '$1.6M+ revenue', 'vc_jacob', 'https://aeoengine.ai'),

-- $100k-$1M Revenue Tier
('medpilot',
 'AI that books patients and grows your medical practice 24/7',
 'An AI assistant that turns patient inquiries into bookings and conversations into loyal relationships.',
 'trustmrr', 'MedPilot', '$500k+ revenue', 'chanxdev', 'https://www.medpilothq.com'),

('brevilabs',
 'Tools for AI agents to access your personal context',
 'Building a future where humans and AI work together seamlessly through context-aware AI tools.',
 'trustmrr', 'Brevilabs', '$500k+ revenue', 'logancyang', 'https://brevilabs.com'),

('vidgenie',
 'Transform stories and podcasts into engaging AI videos',
 'AI-driven video creation tools that transform content into visually engaging videos with artistic styles.',
 'trustmrr', 'Vidgenie.ai', '$475k revenue', 'souravbhar871', 'https://www.vidgenie.ai'),

('localrank',
 'All-in-one local SEO tool that helps agencies scale without hiring',
 'Local rank tracking tool for SEO agencies to manage rankings and client campaigns efficiently.',
 'trustmrr', 'LocalRank.so', '$450k revenue', 'indexsy', 'https://localrank.so'),

('prosp',
 'Automate LinkedIn outreach with hyper-personalized AI messages',
 'Leverage AI to build highly personalized outbound campaigns at scale in seconds, not days.',
 'trustmrr', 'PROSP', '$442k revenue', 'yanndine', 'https://prosp.ai'),

('ai-interview-copilot',
 'Real-time AI coaching during your job interviews',
 'AI-powered platform providing real-time insights and feedback during interview preparation and practice.',
 'trustmrr', 'AI Interview Copilot', '$730k revenue', NULL, NULL),

('apiframe',
 'One API to access Midjourney, DALL-E, and 20+ AI models',
 'Unified API gateway enabling seamless integration of multiple AI models for image, video, and music generation.',
 'trustmrr', 'Apiframe', '$276k revenue', 'ezrenaud', 'https://apiframe.ai'),

('conductor',
 'The best QuickBooks Desktop integration on the planet',
 'Real-time, fully-typed API access to QuickBooks Desktop and Enterprise. Simple integration for developers.',
 'trustmrr', 'Conductor', '$205k revenue', 'DannyNemer', 'https://conductor.is'),

('capgo',
 'Ship app updates instantly without waiting for app store approval',
 'Capacitor plugin enabling app updates without app store submission, solving approval delays.',
 'trustmrr', 'Capgo', '$100k+ revenue', 'martindonadieu', 'https://capgo.app'),

('openalternative',
 'Discover open source alternatives to popular software',
 'Platform helping users find the best open source alternatives to popular proprietary software.',
 'trustmrr', 'OpenAlternative', '$100k+ revenue', 'piotrkulpinski', 'https://openalternative.co'),

('followr',
 'AI-powered social media manager that creates and schedules content',
 'All-in-one platform for automating social media content creation with AI, scheduling, and analytics.',
 'trustmrr', 'Followr', '$375k revenue', 'followr_ai', 'https://followr.ai'),

('calendesk',
 'Website builder with built-in booking system for service businesses',
 'B2B SaaS helping therapists, psychologists, and service businesses manage bookings and payments.',
 'trustmrr', 'Calendesk', '$100k+ revenue', 'maciejcupial', 'https://calendesk.com'),

-- $10k-$100k Revenue Tier
('web3templates',
 'Fast and SEO-optimized templates for Astro and Next.js',
 'High-quality website templates and landing pages built with Astro, Next.js, Tailwind CSS and Sanity CMS.',
 'trustmrr', 'Web3Templates', '$75k revenue', 'surjithctly', 'https://web3templates.com'),

('tinylaunch',
 'Launch your startup today and get a high-authority backlink',
 'Platform enabling startups to launch products and gain exposure through directory submissions.',
 'trustmrr', 'TinyLaunch', '$29k revenue', 'chrissyinspace', 'https://www.tinylaunch.com'),

('wishkit',
 'Build better iOS apps with customer feedback and voting',
 'A service that lets you see and manage feature requests that are created and voted on in your app.',
 'trustmrr', 'WishKit', '$24k revenue', 'martinlasek', 'https://www.wishkit.io'),

('transfer-zip',
 'Send huge files with no size limits and no throttling',
 'Ultrafast, reliable file transfers with strong privacy protections. No restrictions on file size.',
 'trustmrr', 'Transfer.zip', '$12k revenue', 'JigsawClient', 'https://transfer.zip'),

('focusmo',
 'Focus app designed specifically for ADHD minds',
 'Helps users log their day to reduce distractions and improve productivity through time management.',
 'trustmrr', 'Focusmo', '$11k revenue', 'kshetezvinayak', 'https://www.focusmo.app'),

-- Early Stage / Growing
('cvtailor',
 'Tailor your CV to any job description in seconds with AI',
 'AI-powered resume customization that transforms one CV into multiple versions matched to specific jobs.',
 'trustmrr', 'cvtailor.ai', 'growing', 'cvtailorai', 'https://www.cvtailor.ai'),

('cleanclip',
 'Minimalist clipboard manager for Mac power users',
 'Seamless clipboard management with minimalist UI and advanced productivity features for macOS.',
 'trustmrr', 'CleanClip Pro', 'growing', 'sintoneli', 'https://cleanclip.cc'),

('fiddl-art',
 'Create AI art in seconds and earn when others engage',
 'Creative platform for high quality AI images and videos. Magic Mirror gives fast guided results.',
 'trustmrr', 'Fiddl.art', 'growing', 'fiddlart', 'https://fiddl.art');
