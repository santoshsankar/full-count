import { Component } from "react";

// Catches any render/lifecycle error in its subtree and shows a visible
// recovery screen instead of letting React unmount the whole app (which would
// leave only the dark body background — the "blue screen" failure mode).
//
// NOTE: this does NOT catch errors thrown inside async callbacks (setTimeout,
// promises) — React error boundaries never do. It catches render-phase and
// lifecycle throws, which is what blanks the screen.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Loud, un-swallowed: the real stack is preserved for diagnosis.
    console.error(
      "[ErrorBoundary] Uncaught render error:",
      error,
      info?.componentStack
    );
  }

  handleReset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="error-recovery scanlines crt-vignette">
          <div className="error-recovery__card px-box">
            <h1 className="error-recovery__title headline-flat">SOMETHING WENT WRONG</h1>
            <p className="error-recovery__msg">
              The play hit a snag. Your baseball IQ and roster are safe.
            </p>
            <button
              type="button"
              className="error-recovery__btn px-box"
              onClick={this.handleReset}
            >
              {this.props.resetLabel || "TAP TO CONTINUE ▸"}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
