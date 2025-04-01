import RadarVisualization from "@/components/RadarVisualization";
import TechnologyList from "@/components/TechnologyList";

export default function HomePage() {
  return (
    <div className="bg-slate-50 dark:bg-gray-900">
      <RadarVisualization />
      <TechnologyList />
    </div>
  );
}
