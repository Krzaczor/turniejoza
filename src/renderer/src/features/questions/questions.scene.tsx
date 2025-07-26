import { ButtonScene } from "@renderer/lib/react-scene";

export const QuestionsScene = () => {
  return (
    <div className="relative min-h-screen p-2 md:p-6">
      <h1>QuestionsScene</h1>

      {/* Przycisk powrotu w lewym dolnym rogu */}
      <div className="absolute bottom-4 left-4">
        <ButtonScene scene="menu" className="text-lg flex items-center gap-1 hover:text-indigo-100">
          ↩ <span className="hidden sm:inline">Wróć</span>
        </ButtonScene>
      </div>
    </div>
  );
};
