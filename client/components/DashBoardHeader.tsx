"use client";

export const DashBoardHeader = () => {
  return (
    <header className="bg-black border-b border-gray-700 px-6 py-4 text-white ">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <div className="flex items-center gap-10">
          <p className="text-[24px] font-medium tracking-[-0.03em] leading-8">
            Remotia
          </p>

          <div className="flex items-center gap-2">
              <img src={"/tinder-logo.svg"} alt="Tinder" className="h-7" />
              <span className="text-white font-medium">Tinder</span>
              <svg
                className="w-4 h-4 text-white ml-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
          </div>
        </div>

        <div className="flex items-center gap-x-8">
      {['Нүүр', 'Төслүүд', 'Таскууд', 'Календар'].map((item, idx) => (
        <div key={idx} className="group flex items-center gap-2 cursor-pointer hover:text-white transition">
          <img src={`/${item === 'Нүүр' ? 'home' : item === 'Төслүүд' ? 'folder' : item === 'Таскууд' ? 'task' : 'calendar'}.svg`} alt={item} className="h-6" />
          <p className="text-xl text-[#A5A5A9] group-hover:text-white transition">{item}</p>
        </div>
      ))}
    </div>

        <div className="flex items-center gap-3 bg-[#101014] border border-[#26282A] rounded-full px-4 py-2">
          <img
            src={"/user.svg"}
            alt="User"
            className="w-12 h-12 rounded-full border border-[#434043]"
          />
          <div className="flex flex-col">
            <span className="text-sm">Broklyn Simmons</span>
            <span className="text-xs bg-white text-black px-2 rounded-xl w-fit">
              Admin
            </span>
          </div>
          <svg
            className="w-4 h-4 transform rotate-[-90deg] ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>
    </header>
  );
};