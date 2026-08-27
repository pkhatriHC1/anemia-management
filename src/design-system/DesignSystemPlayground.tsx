import "./tokens/css/variables.css";
import { Shell } from "./layouts";
import { SECTIONS } from "./docs";

export function DesignSystemPlayground() {
  return <Shell sections={SECTIONS} />;
}
