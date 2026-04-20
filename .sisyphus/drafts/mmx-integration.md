# mmx CLI Integration Planning for CareerAC

## App Context
- **App**: CareerAC — AI-native community college transfer planning platform
- **Core Flow**: Landing → Sign up → Chat with AI to build transfer plan → Track progress
- **Key Pages**: Landing page, Dashboard, Plan generation chat, Playbooks (community stories)

## mmx CLI Capabilities

| Capability | Description |
|------------|-------------|
| `mmx image generate` | Generate images (image-01 model) |
| `mmx video generate` | Generate video (MiniMax-Hailuo-2.3) |
| `mmx speech synthesize` | Text-to-speech (speech-2.8-hd, 10k chars) |
| `mmx music generate` | Generate music (music-2.6-free) |
| `mmx vision describe` | Image understanding via VLM |
| `mmx search query` | Web search |

## Potential Use Cases for CareerAC

### 1. Landing Page Enhancement
- **Hero images**: Generate personalized hero visuals for different user segments (CS majors, nursing, business)
- **How It Works illustrations**: Replace static icons with AI-generated contextual illustrations
- **Social sharing images**: Auto-generate OG images for shared links

### 2. User-Generated Content
- **Playbook cover images**: Generate cover art for transfer story submissions
- **Avatar generation**: Create stylized avatars from user descriptions for anonymous playbooks
- **Video testimonials**: Generate short intro/outro videos for playbook stories

### 3. Onboarding/Explainer Content
- **Onboarding video**: AI-generated explainer video showing the transfer planning flow
- **Course explanation videos**: Generate short videos explaining transfer requirements
- **Voice announcements**: Speech synthesis for in-app guidance

### 4. Marketing & Social
- **Social media content**: Generate images/videos for Instagram/TikTok campaigns
- **Ad creatives**: A/B test different visual variants
- **Email header images**: Personalized headers based on user's target university

### 5. Accessibility
- **Audio descriptions**: Speech synthesis for visual content
- **Text-to-speech for plans**: Audio version of transfer plans

### 6. AI Enhancement (via vision + search)
- **Image validation**: Verify uploaded documents/screenshots in playbooks
- **Transfer research**: Search for latest articulation agreements and requirements

## Open Questions
1. Which area to focus on first?
2. Should content be generated at build time or runtime?
3. Any specific pages/features that need visual content?
