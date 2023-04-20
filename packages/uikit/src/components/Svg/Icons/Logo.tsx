import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return <img src="/images/logo/logo-mobile.png" {...props} width="60px" style={{ borderRadius: "16px" }} />;
};

export default Icon;
