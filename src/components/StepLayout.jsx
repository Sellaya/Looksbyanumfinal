"use client"

export default function StepLayout({ title, children, onBack, onNext, nextText = "Next", backText = "Back", actions }) {
  return (
    <div className="bg-white text-gray-900 p-4 md:p-6 rounded-lg shadow-lg border border-gray-200 ">
      <h2 className="mt-0 text-sm md:text-lg text-gray-900">{title}</h2>
      <div className="grid gap-3">{children}</div>
      <div className="flex justify-between mt-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="px-3 py-1.5 md:px-4 md:py-3 bg-gray-200 text-gray-900 border border-gray-300 rounded-md hover:bg-gray-300 transition"
          >
            {" "}
            {backText}{" "}
          </button>
        ) : (
          <span />
        )}
        {actions
          ? actions
          : onNext && (
              <button
                onClick={onNext}
                className="px-3 py-1.5 md:px-4 md:py-3 bg-gray-700 text-white border-none rounded-md hover:bg-gray-800 transition"
              >
                {nextText}
              </button>
            )}
      </div>
    </div>
  )
}
