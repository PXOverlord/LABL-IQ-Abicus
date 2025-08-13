import svgPaths from "./svg-5xwd507kdf";
import imgImage from "figma:asset/de9ddf0bc30b901b927e34b55778ffc4b1264616.png";

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

function HeaderCardSidebar10() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-3 items-center justify-start overflow-clip p-[12px] relative rounded-[10px] shrink-0"
      data-name="Header Card [Sidebar] [1.0]"
    >
      <Labl />
    </div>
  );
}

function SidebarHeaderSidebar10() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-col gap-3 items-center justify-center overflow-clip p-[12px] relative shrink-0 w-20"
      data-name="Sidebar Header [Sidebar] [1.0]"
    >
      <HeaderCardSidebar10 />
      <div className="absolute bottom-0 h-0 left-5 right-5" data-name="Divider">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 40 1"
          >
            <line
              id="Divider"
              stroke="var(--stroke-0, #E1E4EA)"
              x2="40"
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
            fill="var(--fill-0, #525866)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Buttons10() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0"
      data-name="Buttons [1.0]"
    >
      <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[8px] relative">
        <Search2Line />
      </div>
      <div className="absolute border border-[#e1e4ea] border-solid inset-0 pointer-events-none rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]" />
    </div>
  );
}

function TextDivider() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-0 py-1 relative shrink-0 w-full"
      data-name="Text Divider"
    >
      <div className="basis-0 css-i1cpr8 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#99a0ae] text-[12px] text-center tracking-[0.48px] uppercase">
        <p className="block leading-[16px]">Main</p>
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
              stroke="var(--stroke-0, #525866)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.pc778440}
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

function SidebarItemsSidebar10() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-lg shrink-0 size-9"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <div className="absolute bg-[#525866] h-5 left-[-22px] rounded-br-[4px] rounded-tr-[4px] top-[570px] w-1" />
      <Frame />
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

function SidebarItemsSidebar11() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-lg shrink-0 size-9"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <Frame1 />
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

function SidebarItemsSidebar12() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-lg shrink-0 size-9"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <Frame2 />
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

function SidebarItemsSidebar13() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-lg shrink-0 size-9"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <Frame3 />
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

function SidebarItemsSidebar14() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-lg shrink-0 size-9"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <Frame4 />
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

function SidebarItemsSidebar15() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-lg shrink-0 size-9"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <Frame5 />
    </div>
  );
}

function Navigation() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0 w-full"
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
      className="box-border content-stretch flex flex-col gap-2 items-center justify-center p-0 relative shrink-0 w-full"
      data-name="Main Content"
    >
      <TextDivider />
      <Navigation />
    </div>
  );
}

function TextDivider1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-0 py-1 relative shrink-0 w-full"
      data-name="Text Divider"
    >
      <div className="basis-0 css-i1cpr8 font-['Inter:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#99a0ae] text-[12px] text-center tracking-[0.48px] uppercase">
        <p className="block leading-[16px]">FAVS</p>
      </div>
    </div>
  );
}

function ChartLegendDots16() {
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

function SidebarItemsSidebar16() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-lg shrink-0"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <ChartLegendDots16 />
    </div>
  );
}

function ChartLegendDots17() {
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

function SidebarItemsSidebar17() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-lg shrink-0"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <ChartLegendDots17 />
    </div>
  );
}

function ChartLegendDots18() {
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

function SidebarItemsSidebar18() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-lg shrink-0"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <ChartLegendDots18 />
    </div>
  );
}

function Navigation1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0 w-full"
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
      className="box-border content-stretch flex flex-col gap-1.5 items-center justify-start p-0 relative shrink-0 w-full"
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

function SidebarItemsSidebar19() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-lg shrink-0"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <CheckDoubleLine />
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

function SidebarItemsSidebar20() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-lg shrink-0"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <Inbox2Line />
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
            fill="var(--fill-0, #319B82)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function SidebarItemsSidebar21() {
  return (
    <div
      className="bg-[#f5f7fa] box-border content-stretch flex flex-row gap-2 items-center justify-start p-[8px] relative rounded-lg shrink-0"
      data-name="Sidebar Items [Sidebar] [1.0]"
    >
      <Settings2Line />
    </div>
  );
}

function SupportingContent() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-1.5 grow items-center justify-end min-h-px min-w-px p-0 relative shrink-0 w-full"
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
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-5 items-center justify-start pb-4 pt-5 px-3 relative size-full">
          <Buttons10 />
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
      className="bg-[#ffecc0] relative rounded-[999px] shrink-0 size-10"
      data-name="Avatar [1.0]"
    >
      <div
        className="[background-size:170%_170%] absolute bg-[46.65%_47.62%] bg-no-repeat inset-0 rounded-[999px]"
        data-name="image"
        style={{ backgroundImage: `url('${imgImage}')` }}
      />
    </div>
  );
}

function UserProfileCardSidebar10() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-3 items-center justify-center overflow-clip p-[12px] relative rounded-[10px] shrink-0"
      data-name="User Profile Card [Sidebar] [1.0]"
    >
      <Avatar10 />
    </div>
  );
}

function SidebarFooterSidebar10() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-3 items-center justify-center overflow-clip p-[12px] relative shrink-0 w-20"
      data-name="Sidebar Footer [Sidebar] [1.0]"
    >
      <UserProfileCardSidebar10 />
      <div className="absolute h-0 left-5 right-5 top-px" data-name="Divider">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 40 1"
          >
            <line
              id="Divider"
              stroke="var(--stroke-0, #E1E4EA)"
              x2="40"
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