// Tweaks app — applies user-selected design variables to the page.
// Page layout itself is static HTML; this just sets CSS variables on :root.

const BLACKMOON_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "amber",
  "displayFont": "cormorant",
  "heroDarkness": 78,
  "showNumbers": true,
  "showMarquee": true,
  "tightDensity": false
}/*EDITMODE-END*/;

const ACCENT_PRESETS = {
  amber:  { accent: 'oklch(0.74 0.13 65)',  accent2: 'oklch(0.55 0.16 30)',  label: 'Amber' },
  ember:  { accent: 'oklch(0.68 0.18 28)',  accent2: 'oklch(0.55 0.16 12)',  label: 'Ember' },
  bone:   { accent: 'oklch(0.92 0.018 80)', accent2: 'oklch(0.78 0.05 70)',  label: 'Bone'  },
  jade:   { accent: 'oklch(0.72 0.11 165)', accent2: 'oklch(0.55 0.10 175)', label: 'Jade'  },
};

const DISPLAY_FONTS = {
  cormorant: { stack: "'Cormorant Garamond', 'Noto Serif SC', ui-serif, Georgia, serif", label: 'Cormorant' },
  serifSC:   { stack: "'Noto Serif SC', 'Cormorant Garamond', serif",                     label: 'Noto Serif SC' },
  dm:        { stack: "'DM Sans', ui-sans-serif, system-ui, sans-serif",                  label: 'DM Sans' },
};

function TweaksApp(){
  const [t, setTweak] = useTweaks(BLACKMOON_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement;
    const a = ACCENT_PRESETS[t.accent] || ACCENT_PRESETS.amber;
    root.style.setProperty('--accent',   a.accent);
    root.style.setProperty('--accent-2', a.accent2);

    const f = DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS.cormorant;
    root.style.setProperty('--f-display', f.stack);

    document.body.setAttribute('data-numbers', t.showNumbers ? 'on' : 'off');
    document.body.setAttribute('data-density', t.tightDensity ? 'tight' : 'regular');

    const marquee = document.querySelector('.marquee');
    if (marquee) marquee.style.display = t.showMarquee ? '' : 'none';

    // Hero photo darkness — lower = darker
    const heroMedia = document.querySelector('.hero-media');
    if (heroMedia) {
      const brightness = (t.heroDarkness ?? 78) / 100;
      heroMedia.style.filter = `brightness(${brightness}) saturate(1.05)`;
    }
  }, [t]);

  return (
    <TweaksPanel title="Tweaks · Blackmoon">
      <TweakSection label="Accent" />
      <TweakRadio  label="Palette" value={t.accent}
                   options={['amber','ember','bone','jade']}
                   onChange={(v) => setTweak('accent', v)} />

      <TweakSection label="Typography" />
      <TweakSelect label="Display font" value={t.displayFont}
                   options={[
                     { value:'cormorant', label:'Cormorant Garamond' },
                     { value:'serifSC',   label:'Noto Serif SC' },
                     { value:'dm',        label:'DM Sans' },
                   ]}
                   onChange={(v) => setTweak('displayFont', v)} />

      <TweakSection label="Hero photo" />
      <TweakSlider label="Darkness" value={t.heroDarkness} min={50} max={95} unit="%"
                   onChange={(v) => setTweak('heroDarkness', v)} />

      <TweakSection label="Layout" />
      <TweakToggle label="Section numbers"   value={t.showNumbers}
                   onChange={(v) => setTweak('showNumbers', v)} />
      <TweakToggle label="Marquee divider"   value={t.showMarquee}
                   onChange={(v) => setTweak('showMarquee', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TweaksApp />);
