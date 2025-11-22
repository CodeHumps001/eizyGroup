# 📍 Ad Placement Visual Guide

## Landing Page (index.html)

```
┌─────────────────────────────────────┐
│         Navigation Header            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         HERO SECTION                │
│    Get Started | Learn More          │
└─────────────────────────────────────┘

╔═════════════════════════════════════╗
║   AD SLOT 1: TOP BANNER (728x90)   ║  ← Users see ads after engaging with hero
║        Horizontal Responsive        ║
╚═════════════════════════════════════╝

┌─────────────────────────────────────┐
│         How to Use Section          │
│      (4 Feature Cards)              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Why Use eizyGroup?          │
│      (Benefits/Features)            │
└─────────────────────────────────────┘

╔═════════════════════════════════════╗
║  AD SLOT 2: BOTTOM BANNER (728x90) ║  ← Second impression before leaving
║        Horizontal Responsive        ║
╚═════════════════════════════════════╝

┌─────────────────────────────────────┐
│         Footer                      │
│     © 2024 eizyGroup                │
└─────────────────────────────────────┘
```

## Dashboard (dashboard.html)

```
DESKTOP VIEW:
┌──────────────┬──────────────────────────┐
│   Sidebar    │    Main Content          │
│  • Overview  │                          │
│  • Generator │    Generator Tab         │
│  • History   │                          │
│  • Settings  │    [Results Area]        │
│              │                          │
│ ┌──────────┐ │ ┌──────────────────────┐ │
│ │ AD SLOT 3│ │ │   Grouped Results    │ │
│ │ Vertical │ │ │                      │ │
│ │ 300x600  │ │ │   Export Section     │ │
│ │          │ │ └──────────────────────┘ │
│ └──────────┘ │                          │
│              │ ╔══════════════════════╗ │
│ [Logout]     │ ║  AD SLOT 4: HORIZ   ║ │  ← Between generator and history
│              │ ║      (728x90)       ║ │
│              │ ╚══════════════════════╝ │
│              │                          │
│              │   History Tab            │
│              │   (Below ads)            │
└──────────────┴──────────────────────────┘

MOBILE VIEW:
┌──────────────────────┐
│  Mobile Header       │
│  [Tabs: Gen|His|Set] │
└──────────────────────┘
│
│  Generator Content   │
│  [Input Area]        │
│  [Generate Button]   │
│
├──────────────────────┤
│  AD SLOT 3: Vertical │  ← Stacked below nav
│  [300x250 or 320x50] │
├──────────────────────┤
│
│  [Results]           │
│  [Export]            │
│
├──────────────────────┤
│ AD SLOT 4: Horizontal│  ← Between sections
│ [320x50 or 320x100]  │
├──────────────────────┤
│
│  History Tab Content │
│
└──────────────────────┘
```

## Ad Types and Sizes

### Standard Ad Sizes (All Implemented)

1. **Horizontal Banners**

   - Desktop: 728x90 (Leaderboard)
   - Mobile: 320x50 or 320x100 (Mobile Banner)
   - Setting: `data-ad-format="horizontal"` + `data-full-width-responsive="true"`

2. **Vertical Sidebar**

   - Desktop: 300x600 (Half Page) or 300x250 (Medium Rectangle)
   - Mobile: 300x250 or 320x250
   - Setting: `data-ad-format="vertical"` + `data-full-width-responsive="false"`

3. **Responsive**
   - Automatically adapts to screen size
   - All ads use `data-full-width-responsive="true"`
   - Best practice for mixed traffic

## User Journey with Ads

### Desktop User Flow

```
1. Lands on homepage
   ↓
2. Sees hero section (get engaged)
   ↓
3. Sees AD #1 (IMPRESSION 1)
   ↓
4. Scrolls through benefits
   ↓
5. Sees AD #2 (IMPRESSION 2)
   ↓
6. Clicks "Get Started" / Login
   ↓
7. Enters dashboard
8. Sees AD #3 in sidebar (IMPRESSION 3)
   ↓
9. Generates groups
10. Sees AD #4 below results (IMPRESSION 4)
    ↓
11. Exports/Shares
    → Repeat with more groups = More impressions
```

### Mobile User Flow

```
1. Mobile view - full width
2. Navigates tabs (Gen/His/Set)
3. Ads auto-adjust to mobile format
4. Vertical ads become 300x250 or 320x100
5. Horizontal ads become 320x50 or 320x100
6. All ads remain responsive
```

## Revenue Impact per User

### Ad Impressions per Session

- **Average user**: 2-3 impressions
- **Power user** (multiple generations): 4-6 impressions
- **Returning user**: 8-10+ impressions/week

### Impression Types

- **View-only**: User sees ad (counted as impression)
- **Click**: User clicks ad (generates higher revenue)
- **CPM**: Cost per 1000 impressions (your main earning)

## Optimization Notes

### Why These Placements?

1. **Top Banner (After Hero)**

   - Users are engaged with content
   - Natural pause point
   - High visibility

2. **Bottom Banner (Before Footer)**

   - Users deciding whether to sign up
   - Final impression opportunity
   - Less intrusive than middle

3. **Sidebar Ad**

   - Passive viewing while using app
   - Doesn't interfere with main task
   - Repeated impressions per session

4. **Content Ad (Between Sections)**
   - Natural content break
   - Users already engaged
   - Strategic pause point

### Click-Through Rate Expectations

- Landing page: 0.5-1.5% CTR (education niche)
- Dashboard: 0.2-0.8% CTR (less relevant to busy users)
- Overall: 0.3-1% typical for education tools

## Performance Metrics

### Self-Check Questions

- Do ads load fast? (Should be instant)
- Do ads look good on mobile? (Should be responsive)
- Do ads interfere with usability? (Should be minimal)
- Are ads relevant? (Google determines this)

### What Users See

- Google ad system automatically shows relevant ads
- Education/Teaching tools typically appear
- Sponsored links to EdTech products
- Learning platforms and resources

## Future Enhancements (Optional)

### 1. Native Ads (Higher CTR)

```html
<ins
  class="adsbygoogle"
  style="display:block"
  data-ad-format="native"
  data-ad-layout="carousel"
  data-ad-layout-keys="---gly--"
></ins>
```

### 2. In-Article Ads (Inside Results)

- Show ads between groups
- Less intrusive monetization
- Good for longer result lists

### 3. Sticky Ads (Desktop)

- Ad stays visible while scrolling
- Higher engagement
- Can be annoying - use cautiously

---

**Layout is optimized for both revenue and user experience!**
