import React, { useEffect, useRef } from "react";
import * as OV from "online-3d-viewer";

import styles from "./ModelViewer.module.scss";

const ModelViewer = ({ modelUrl, textureUrl }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (viewerRef.current) {
      const viewer = new OV.EmbeddedViewer(viewerRef.current, {
        backgroundColor: new OV.RGBAColor(239, 239, 239, 239),
        defaultColor: new OV.RGBColor(200, 200, 200),
        edgeSettings: new OV.EdgeSettings(false, new OV.RGBColor(0, 0, 0), 1),
      });

      viewer.viewer.InitShading();
      let ambientLight = viewer.viewer.shadingModel.ambientLight;
      ambientLight.color.set(0x888888);

      ambientLight.position.set(0.0, 0.0, 1.0);
      viewer.viewer.shadingModel.scene.add(ambientLight);

      viewer.viewer.shadingModel.UpdateShading();
      viewer.viewer.Render();
      viewer.viewer.shadingModel.SetShadingType(OV.ShadingType.Physical);

      const modelFiles = [modelUrl];
      if (textureUrl) {
        modelFiles.push(textureUrl);
      }

      viewer.LoadModelFromUrlList(modelFiles);
    }
  }, [modelUrl, textureUrl]);

  return <div ref={viewerRef} className={styles.viewerContainer}></div>;
};

export default ModelViewer;
