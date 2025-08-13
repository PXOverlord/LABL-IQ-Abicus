import svgPaths from "./svg-0qrvyl6wrv";
import imgImage from "figma:asset/de9ddf0bc30b901b927e34b55778ffc4b1264616.png";
import imgImage1 from "figma:asset/91b2c640265228f991f56c9326309d90f47b8d15.png";

function Group() {
  return (
    <div
      className="absolute h-[20.002px] left-1/2 translate-x-[-50%] translate-y-[-50%] w-5"
      data-name="Group"
      style={{ top: "calc(50% + 0.000938416px)" }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="Group">
          <path
            d={svgPaths.p2711f100}
            fill="var(--fill-0, white)"
            id="Vector"
          />
          <path
            d={svgPaths.p3516ff80}
            fill="var(--fill-0, white)"
            id="Vector_2"
          />
        </g>
      </svg>
    </div>
  );
}

function Labl() {
  return (
    <div
      className="bg-[#222530] overflow-clip relative rounded-[999px] shrink-0 size-10"
      data-name="Labl"
    >
      <Group />
    </div>
  );
}

function Name() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Name"
    >
      <div className="basis-0 css-a95tsy font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#0e121b] text-[14px] text-left tracking-[-0.084px]">
        <p className="block leading-[20px]">Acme Sunglasses</p>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow h-10 items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <Name />
      <div className="css-d0gmu1 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[12px] text-left w-full">
        <p className="block leading-[16px]">Labl PX Platform</p>
      </div>
    </div>
  );
}

function HeaderCardSidebar10() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-3 items-center justify-start overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-[248px]"
      data-name="Header Card [Sidebar] [1.0]"
    >
      <Labl />
      <Text />
    </div>
  );
}

function SidebarHeaderSidebar10() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-3 items-center justify-center overflow-clip p-[12px] relative shrink-0 w-[272px]"
      data-name="Sidebar Header [Sidebar] [1.0]"
    >
      <HeaderCardSidebar10 />
      <div className="absolute bottom-0 h-0 left-5 right-5" data-name="Divider">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 232 1"
          >
            <line
              id="Divider"
              stroke="var(--stroke-0, #E1E4EA)"
              x2="232"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Search2Line() {
  return (
    <div className="relative shrink-0 size-5" data-name="search-2-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="search-2-line">
          <path
            d={svgPaths.p34d12c00}
            fill="var(--fill-0, #99A0AE)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Shortcut() {
  return (
    <div
      className="bg-[#ffffff] relative rounded shrink-0"
      data-name="Shortcut"
    >
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-start overflow-clip px-1.5 py-0.5 relative">
        <div className="css-i1cpr8 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#99a0ae] text-[12px] text-left text-nowrap tracking-[0.48px] uppercase">
          <p className="adjustLetterSpacing block leading-[16px] whitespace-pre">
            ⌘1
          </p>
        </div>
      </div>
      <div className="absolute border border-[#e1e4ea] border-solid inset-0 pointer-events-none rounded" />
    </div>
  );
}

function Search() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Search"
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-2.5 pr-2 py-2 relative w-full">
          <Search2Line />
          <div className="basis-0 css-6n7tti font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#99a0ae] text-[14px] text-left tracking-[-0.084px]">
            <p className="block leading-[20px]">Search...</p>
          </div>
          <Shortcut />
        </div>
      </div>
      <div className="absolute border border-[#e1e4ea] border-solid inset-0 pointer-events-none rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]" />
    </div>
  );
}

function TextInput10() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Text Input [1.0]"
    >
      <Search />
    </div>
  );
}

function TextDivider() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text Divider">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-[4px] relative w-full">
          <div className="basis-0 css-i1cpr8 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#99a0ae] text-[12px] text-left tracking-[0.48px] uppercase">
            <p className="block leading-[16px]">Main</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div
      className="absolute bottom-[9.722%] left-[15.278%] right-[15.278%] top-[11.144%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-5.265%] left-[-6%] right-[-6%] top-[-5.265%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 16"
        >
          <g id="Group">
            <path
              d={svgPaths.p5202e00}
              id="Vector"
              stroke="var(--stroke-0, #319B82)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.pc778440}
              id="Vector_2"
              stroke="var(--stroke-0, #319B82)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div
      className="overflow-clip relative shrink-0 size-[18px]"
      data-name="Frame"
    >
      <Group1 />
    </div>
  );
}

function Text1() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-1 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-a95tsy font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#0e121b] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Home
        </p>
      </div>
    </div>
  );
}

function ArrowRightSLine() {
  return (
    <div className="relative shrink-0 size-5" data-name="arrow-right-s-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="arrow-right-s-line">
          <path
            d={svgPaths.p2a044f00}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function SidebarItemsSidebar10() {
  return (
    <div
      className="bg-[#f5f7fa] relative rounded-lg shrink-0 w-full"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <Frame />
          <Text1 />
          <ArrowRightSLine />
          <div className="absolute bg-[#319b82] h-5 left-[-20px] rounded-br-[4px] rounded-tr-[4px] top-2 w-1" />
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div
      className="absolute bottom-[15.278%] left-[9.722%] right-[9.722%] top-[15.278%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-6%] left-[-5.172%] right-[-5.172%] top-[-6%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 15"
        >
          <g id="Group">
            <path
              d="M1 5H15.5"
              id="Vector"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M1 9.5H15.5"
              id="Vector_2"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M5 1V13.5"
              id="Vector_3"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p29d33680}
              id="Vector_4"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div
      className="overflow-clip relative shrink-0 size-[18px]"
      data-name="Frame"
    >
      <Group2 />
    </div>
  );
}

function Text2() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-1 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-hi8iy1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Order Management
        </p>
      </div>
    </div>
  );
}

function SidebarItemsSidebar11() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <Frame1 />
          <Text2 />
        </div>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div
      className="absolute bottom-[9.975%] left-[15.278%] right-[15.278%] top-[10.004%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-5.207%] left-[-6%] right-[-6%] top-[-5.207%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 17"
        >
          <g id="Group">
            <path
              d={svgPaths.p9ce8380}
              id="Vector"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p174598a0}
              id="Vector_2"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div
      className="overflow-clip relative shrink-0 size-[18px]"
      data-name="Frame"
    >
      <Group3 />
    </div>
  );
}

function Text3() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-1 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-hi8iy1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Shipping Protection
        </p>
      </div>
    </div>
  );
}

function Badge10() {
  return (
    <div
      className="bg-[#5dc9aa] box-border content-stretch flex flex-row gap-0.5 items-center justify-center overflow-clip p-[2px] relative rounded-[999px] shrink-0"
      data-name="Badge [1.0]"
    >
      <div className="css-iv92a1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[11px] text-center tracking-[0.22px] uppercase w-3">
        <p className="adjustLetterSpacing block leading-[12px]">8</p>
      </div>
    </div>
  );
}

function SidebarItemsSidebar12() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <Frame2 />
          <Text3 />
          <Badge10 />
        </div>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div
      className="absolute bottom-[15.278%] left-[9.722%] right-[9.722%] top-[15.278%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-6%] left-[-5.172%] right-[-5.172%] top-[-6%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 15"
        >
          <g id="Group">
            <path
              d={svgPaths.p29d33680}
              id="Vector"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p22f4ff00}
              id="Vector_2"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M6 6.5L4 8.5L6 10.5"
              id="Vector_3"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div
      className="overflow-clip relative shrink-0 size-[18px]"
      data-name="Frame"
    >
      <Group4 />
    </div>
  );
}

function Text4() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-1 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-hi8iy1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">{`Returns & Exchanges`}</p>
      </div>
    </div>
  );
}

function Badge11() {
  return (
    <div
      className="bg-[#5dc9aa] box-border content-stretch flex flex-row gap-0.5 items-center justify-center overflow-clip p-[2px] relative rounded-[999px] shrink-0"
      data-name="Badge [1.0]"
    >
      <div className="css-iv92a1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[11px] text-center tracking-[0.22px] uppercase w-3">
        <p className="adjustLetterSpacing block leading-[12px]">2</p>
      </div>
    </div>
  );
}

function SidebarItemsSidebar13() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <Frame3 />
          <Text4 />
          <Badge11 />
        </div>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div
      className="absolute bottom-[4.167%] left-[15.278%] right-[4.167%] top-[9.722%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-4.839%] left-[-5.172%] right-[-5.172%] top-[-4.839%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 17 18"
        >
          <g id="Group">
            <path
              d="M4 6H6"
              id="Vector"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M4 9H8.5"
              id="Vector_2"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p4b15f00}
              id="Vector_3"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p3d586700}
              id="Vector_4"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p664ce80}
              id="Vector_5"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div
      className="overflow-clip relative shrink-0 size-[18px]"
      data-name="Frame"
    >
      <Group5 />
    </div>
  );
}

function Text5() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-1 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-hi8iy1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Product Protection
        </p>
      </div>
    </div>
  );
}

function SidebarItemsSidebar14() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <Frame4 />
          <Text5 />
        </div>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div
      className="absolute bottom-[18.056%] left-[15.278%] right-[15.278%] top-[18.056%]"
      data-name="Group"
    >
      <div className="absolute bottom-[-6.522%] left-[-6%] right-[-6%] top-[-6.522%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 14"
        >
          <g id="Group">
            <path
              d={svgPaths.p11460d80}
              id="Vector"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p242cbf80}
              id="Vector_2"
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div
      className="overflow-clip relative shrink-0 size-[18px]"
      data-name="Frame"
    >
      <Group6 />
    </div>
  );
}

function Text6() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-1 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-hi8iy1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Tracking
        </p>
      </div>
    </div>
  );
}

function SidebarItemsSidebar15() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <Frame5 />
          <Text6 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Navigation"
    >
      <SidebarItemsSidebar10 />
      <SidebarItemsSidebar11 />
      <SidebarItemsSidebar12 />
      <SidebarItemsSidebar13 />
      <SidebarItemsSidebar14 />
      <SidebarItemsSidebar15 />
    </div>
  );
}

function MainContent() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Main Content"
    >
      <TextDivider />
      <Navigation />
    </div>
  );
}

function TextDivider1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text Divider">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-[4px] relative w-full">
          <div className="basis-0 css-i1cpr8 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#99a0ae] text-[12px] text-left tracking-[0.48px] uppercase">
            <p className="block leading-[16px]">FAVS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartLegendDots10() {
  return (
    <div
      className="relative shrink-0 size-5"
      data-name="Chart Legend Dots [1.0]"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g clipPath="url(#clip0_18_936)" id="Chart Legend Dots [1.0]">
          <g filter="url(#filter0_d_18_936)" id="Ellipse">
            <circle cx="10" cy="10" fill="var(--fill-0, #7F4FFF)" r="6" />
            <circle
              cx="10"
              cy="10"
              r="5"
              stroke="var(--stroke-0, white)"
              strokeWidth="2"
            />
          </g>
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="20"
            id="filter0_d_18_936"
            width="20"
            x="0"
            y="2"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.105882 0 0 0 0 0.109804 0 0 0 0 0.113725 0 0 0 0.04 0"
            />
            <feBlend
              in2="BackgroundImageFix"
              mode="normal"
              result="effect1_dropShadow_18_936"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_18_936"
              mode="normal"
              result="shape"
            />
          </filter>
          <clipPath id="clip0_18_936">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-1 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-hi8iy1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Urgent to-do’s
        </p>
      </div>
    </div>
  );
}

function Shortcut1() {
  return (
    <div className="relative rounded shrink-0" data-name="Shortcut">
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-start overflow-clip px-1.5 py-0.5 relative">
        <div className="css-i1cpr8 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#99a0ae] text-[12px] text-left text-nowrap tracking-[0.48px] uppercase">
          <p className="adjustLetterSpacing block leading-[16px] whitespace-pre">
            ⌘1
          </p>
        </div>
      </div>
      <div className="absolute border border-[#e1e4ea] border-solid inset-0 pointer-events-none rounded" />
    </div>
  );
}

function SidebarItemsSidebar16() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <ChartLegendDots10 />
          <Text7 />
          <Shortcut1 />
        </div>
      </div>
    </div>
  );
}

function ChartLegendDots11() {
  return (
    <div
      className="relative shrink-0 size-5"
      data-name="Chart Legend Dots [1.0]"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g clipPath="url(#clip0_18_942)" id="Chart Legend Dots [1.0]">
          <g filter="url(#filter0_d_18_942)" id="Ellipse">
            <circle cx="10" cy="10" fill="var(--fill-0, #FB3748)" r="6" />
            <circle
              cx="10"
              cy="10"
              r="5"
              stroke="var(--stroke-0, white)"
              strokeWidth="2"
            />
          </g>
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="20"
            id="filter0_d_18_942"
            width="20"
            x="0"
            y="2"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.105882 0 0 0 0 0.109804 0 0 0 0 0.113725 0 0 0 0.04 0"
            />
            <feBlend
              in2="BackgroundImageFix"
              mode="normal"
              result="effect1_dropShadow_18_942"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_18_942"
              mode="normal"
              result="shape"
            />
          </filter>
          <clipPath id="clip0_18_942">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-1 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-hi8iy1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Unfinished Returns
        </p>
      </div>
    </div>
  );
}

function Shortcut2() {
  return (
    <div className="relative rounded shrink-0" data-name="Shortcut">
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-start overflow-clip px-1.5 py-0.5 relative">
        <div className="css-i1cpr8 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#99a0ae] text-[12px] text-left text-nowrap tracking-[0.48px] uppercase">
          <p className="adjustLetterSpacing block leading-[16px] whitespace-pre">
            ⌘2
          </p>
        </div>
      </div>
      <div className="absolute border border-[#e1e4ea] border-solid inset-0 pointer-events-none rounded" />
    </div>
  );
}

function SidebarItemsSidebar17() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <ChartLegendDots11 />
          <Text8 />
          <Shortcut2 />
        </div>
      </div>
    </div>
  );
}

function ChartLegendDots12() {
  return (
    <div
      className="relative shrink-0 size-5"
      data-name="Chart Legend Dots [1.0]"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g clipPath="url(#clip0_18_939)" id="Chart Legend Dots [1.0]">
          <g filter="url(#filter0_d_18_939)" id="Ellipse">
            <circle cx="10" cy="10" fill="var(--fill-0, #FB4BA3)" r="6" />
            <circle
              cx="10"
              cy="10"
              r="5"
              stroke="var(--stroke-0, white)"
              strokeWidth="2"
            />
          </g>
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="20"
            id="filter0_d_18_939"
            width="20"
            x="0"
            y="2"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.105882 0 0 0 0 0.109804 0 0 0 0 0.113725 0 0 0 0.04 0"
            />
            <feBlend
              in2="BackgroundImageFix"
              mode="normal"
              result="effect1_dropShadow_18_939"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_18_939"
              mode="normal"
              result="shape"
            />
          </filter>
          <clipPath id="clip0_18_939">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-1 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-2erud9 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="[text-overflow:inherit] adjustLetterSpacing block leading-[20px] overflow-inherit whitespace-pre">
          Exchanges
        </p>
      </div>
    </div>
  );
}

function Shortcut3() {
  return (
    <div className="relative rounded shrink-0" data-name="Shortcut">
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-start overflow-clip px-1.5 py-0.5 relative">
        <div className="css-i1cpr8 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#99a0ae] text-[12px] text-left text-nowrap tracking-[0.48px] uppercase">
          <p className="adjustLetterSpacing block leading-[16px] whitespace-pre">
            ⌘3
          </p>
        </div>
      </div>
      <div className="absolute border border-[#e1e4ea] border-solid inset-0 pointer-events-none rounded" />
    </div>
  );
}

function SidebarItemsSidebar18() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <ChartLegendDots12 />
          <Text9 />
          <Shortcut3 />
        </div>
      </div>
    </div>
  );
}

function Navigation1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Navigation"
    >
      <SidebarItemsSidebar16 />
      <SidebarItemsSidebar17 />
      <SidebarItemsSidebar18 />
    </div>
  );
}

function SideContent() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1.5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Side Content"
    >
      <TextDivider1 />
      <Navigation1 />
    </div>
  );
}

function CheckDoubleLine() {
  return (
    <div className="relative shrink-0 size-5" data-name="check-double-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="check-double-line">
          <path
            d={svgPaths.p276ef3f0}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-1 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-hi8iy1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Tasks
        </p>
      </div>
    </div>
  );
}

function Badge12() {
  return (
    <div
      className="bg-[#5dc9aa] box-border content-stretch flex flex-row gap-0.5 items-center justify-center overflow-clip p-[2px] relative rounded-[999px] shrink-0"
      data-name="Badge [1.0]"
    >
      <div className="css-iv92a1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[11px] text-center tracking-[0.22px] uppercase w-3">
        <p className="adjustLetterSpacing block leading-[12px]">7</p>
      </div>
    </div>
  );
}

function SidebarItemsSidebar19() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <CheckDoubleLine />
          <Text10 />
          <Badge12 />
        </div>
      </div>
    </div>
  );
}

function Inbox2Line() {
  return (
    <div className="relative shrink-0 size-5" data-name="inbox-2-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="inbox-2-line">
          <path
            d={svgPaths.pfeb7600}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Text11() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-1 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-hi8iy1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Inbox
        </p>
      </div>
    </div>
  );
}

function Badge13() {
  return (
    <div
      className="bg-[#5dc9aa] box-border content-stretch flex flex-row gap-0.5 items-center justify-center overflow-clip p-[2px] relative rounded-[999px] shrink-0"
      data-name="Badge [1.0]"
    >
      <div className="css-iv92a1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[11px] text-center tracking-[0.22px] uppercase w-3">
        <p className="adjustLetterSpacing block leading-[12px]">3</p>
      </div>
    </div>
  );
}

function SidebarItemsSidebar20() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <Inbox2Line />
          <Text11 />
          <Badge13 />
        </div>
      </div>
    </div>
  );
}

function Settings2Line() {
  return (
    <div className="relative shrink-0 size-5" data-name="settings-2-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="settings-2-line">
          <path
            d={svgPaths.p37cb6600}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-1 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <div className="css-hi8iy1 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          Settings
        </p>
      </div>
    </div>
  );
}

function SidebarItemsSidebar21() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-full"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <Settings2Line />
          <Text12 />
        </div>
      </div>
    </div>
  );
}

function SupportingContent() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1.5 grow items-start justify-end min-h-px min-w-px p-0 relative shrink-0 w-full"
      data-name="Supporting Content"
    >
      <SidebarItemsSidebar19 />
      <SidebarItemsSidebar20 />
      <SidebarItemsSidebar21 />
    </div>
  );
}

function Content() {
  return (
    <div
      className="basis-0 bg-[#ffffff] grow min-h-px min-w-px relative shrink-0 w-full"
      data-name="Content"
    >
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start pb-4 pt-5 px-5 relative size-full">
          <TextInput10 />
          <MainContent />
          <SideContent />
          <SupportingContent />
        </div>
      </div>
    </div>
  );
}

function Avatar10() {
  return (
    <div
      className="bg-[#d9d3ff] relative rounded-[999px] shrink-0 size-10"
      data-name="Avatar [1.0]"
    >
      <div
        className="[background-size:140%_140%,_cover] absolute bg-[44.11%_50%,_50%_50%] bg-no-repeat inset-0 rounded-[999px]"
        data-name="image"
        style={{ backgroundImage: `url('${imgImage}'), url('${imgImage1}')` }}
      />
    </div>
  );
}

function Name1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-0.5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Name"
    >
      <div className="css-a95tsy font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#0e121b] text-[14px] text-left text-nowrap tracking-[-0.084px]">
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
          LA Drury
        </p>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1 grow h-10 items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Text"
    >
      <Name1 />
      <div className="css-d0gmu1 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[12px] text-left w-full">
        <p className="block leading-[16px]">la.drury@labl.com</p>
      </div>
    </div>
  );
}

function ArrowRightSLine1() {
  return (
    <div className="relative shrink-0 size-5" data-name="arrow-right-s-line">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="arrow-right-s-line">
          <path
            d={svgPaths.p2a044f00}
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function CompactButton10() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-0.5 items-center justify-center overflow-clip p-[2px] relative rounded-md shrink-0"
      data-name="Compact Button [1.0]"
    >
      <ArrowRightSLine1 />
    </div>
  );
}

function UserProfileCardSidebar10() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-3 items-center justify-start overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-[248px]"
      data-name="User Profile Card [Sidebar] [1.0]"
    >
      <Avatar10 />
      <Text13 />
      <CompactButton10 />
    </div>
  );
}

function SidebarFooterSidebar10() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-3 items-center justify-start overflow-clip p-[12px] relative shrink-0 w-[272px]"
      data-name="Sidebar Footer [Sidebar] [1.0]"
    >
      <UserProfileCardSidebar10 />
      <div className="absolute h-0 left-5 right-5 top-px" data-name="Divider">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 232 1"
          >
            <line
              id="Divider"
              stroke="var(--stroke-0, #E1E4EA)"
              x2="232"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function SidebarNavigation10() {
  return (
    <div
      className="bg-[#ffffff] relative size-full"
      data-name="Sidebar [Navigation] [1.0]"
    >
      <div className="box-border content-stretch flex flex-col items-start justify-start p-0 relative size-full">
        <SidebarHeaderSidebar10 />
        <Content />
        <SidebarFooterSidebar10 />
      </div>
      <div className="absolute border-[#e1e4ea] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}