export function Conclusions() {
  return (
    <section className="conclusions-section" aria-labelledby="conclusions-title">
      <div className="section-heading section-heading-light">
        <div>
          <p className="eyebrow">CONCLUSIONS</p>
          <h2 id="conclusions-title">What the model and data suggest</h2>
        </div>
        <span className="conclusions-sample">3,080 input combinations</span>
      </div>
      <p className="conclusions-intro">
        The browser model was evaluated across 3,080 controlled input combinations, using 55 playtime values,
        seven prices, and all eight platform combinations.
      </p>
      <div className="conclusions-findings">
        <article className="conclusion">
          <h3>Playtime had the largest effect on model output.</h3>
          <p>
            With price fixed at €20 and Windows selected, the relative recommendation score increased as
            playtime rose, peaking at <strong>94.67% around 250 hours</strong> before declining to
            <strong> 68.03% at 5,000 hours</strong>. The model does not treat additional playtime as
            indefinitely beneficial.
          </p>
        </article>
        <article className="conclusion">
          <h3>Price had a smaller but noticeable effect.</h3>
          <p>
            At 50 hours with Windows selected, scores ranged from <strong>93.29% at €5</strong> to
            <strong> 85.11% at €100</strong>. The relationship was not perfectly monotonic: €0.99 produced
            91.72%, so the model does not simply favour the lowest possible price.
          </p>
        </article>
        <article className="conclusion">
          <h3>Platform support also changed the model output.</h3>
          <p>
            In the 50-hour, €20 example, the score increased from <strong>91.93% with Windows only</strong> to
            <strong> 94.75% with Windows, macOS, and Linux</strong>. However, every training record includes
            Windows support. Platform combinations without Windows are outside the well-supported region of
            the training data and should not be interpreted meaningfully.
          </p>
        </article>
        <article className="conclusion">
          <h3>Hours played relative to price was also associated with recommendation behaviour.</h3>
          <p>
            Dataset analysis suggests recommendation rates generally increased as hours per euro rose, before
            levelling off. This is an observed association, not evidence that greater playtime or lower price
            causes a recommendation.
          </p>
        </article>
      </div>
      <p className="conclusions-caveat">
        The displayed values are relative model scores, not calibrated probabilities. This sweep describes how
        the fitted classifier responds to different inputs. It does not establish causal relationships or
        guarantee equivalent behaviour for real users.
      </p>
    </section>
  )
}
