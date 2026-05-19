function Loader() {
  return (
    <div className="cube-loader">
      <div className="cube-top" />
      <div className="cube-wrapper">
        <span
          style={{ "--i": 0 } as React.CSSProperties}
          className="cube-span"
        />
        <span
          style={{ "--i": 1 } as React.CSSProperties}
          className="cube-span"
        />
        <span
          style={{ "--i": 2 } as React.CSSProperties}
          className="cube-span"
        />
        <span
          style={{ "--i": 3 } as React.CSSProperties}
          className="cube-span"
        />
      </div>
    </div>
  );
}

export default Loader;
