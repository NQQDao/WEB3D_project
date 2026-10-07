import React from 'react';

export default function HotspotsOverlay({ hotspots, onSelectHotspot }) {
  if (!hotspots || hotspots.length === 0) return null;

  return (
    <div className="hotspots-layer">
      {hotspots.map((hp) => {
        if (!hp.visible) return null;

        return (
          <div
            key={hp.id}
            className="hotspot-pin-wrapper"
            style={{
              transform: `translate(-50%, -50%) translate(${hp.x}px, ${hp.y}px)`,
            }}
          >
            <button
              className="hotspot-pin"
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(hp.item);
              }}
              aria-label={`Xem chi tiết ${hp.name}`}
            >
              <span className="hotspot-pulse-outer"></span>
              <span className="hotspot-pulse"></span>
              <span className="hotspot-dot">
                <span className="hotspot-inner-core"></span>
              </span>
              <span className="hotspot-label">
                <span className="label-icon">✦</span>
                <span className="label-text">{hp.name}</span>
              </span>
            </button>

            {/* Smart Holographic Tooltip on Hover */}
            <div className="hotspot-hover-card">
              <div className="hover-card-category">{hp.item?.category || 'Sản phẩm 3D'}</div>
              <div className="hover-card-name">{hp.name}</div>
              <div className="hover-card-footer">
                <span className="hover-card-price">{hp.item?.price || '$0'}</span>
                <span className="hover-card-action">Tùy biến 3D &rarr;</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
