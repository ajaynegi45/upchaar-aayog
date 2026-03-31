"use client";

export default function MedicineSearch() {
  return (
    <form 
      className="flex flex-col md:flex-row gap-4" 
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex-grow">
        <input
          className="w-full border-none bg-surface-container-high focus:ring-2 focus:ring-primary/20 rounded-lg py-4 px-6 text-on-surface placeholder:text-outline"
          placeholder="Enter medicine name (e.g., Crocin)"
          type="text"
          aria-label="Medicine name search"
        />
      </div>
      <button 
        type="submit"
        className="bg-secondary text-on-secondary px-8 py-4 rounded-lg font-bold hover:bg-secondary-dim transition-all shadow-sm active:scale-95 whitespace-nowrap"
      >
        Check Alternative
      </button>
    </form>
  );
}
