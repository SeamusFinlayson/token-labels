import * as RadixSlider from "@radix-ui/react-slider";

const Slider = (sliderProps: RadixSlider.SliderProps) => (
  <RadixSlider.Root
    className="relative flex h-5 w-full touch-none select-none items-center"
    {...sliderProps}
  >
    <RadixSlider.Track className="bg-mirage-950 relative h-[4px] grow rounded-full">
      <RadixSlider.Range className="bg-primary-dark/60 absolute h-full rounded-full" />
    </RadixSlider.Track>
    <RadixSlider.Thumb className="bg-primary-dark block size-5 rounded-[10px] shadow-xl outline-none outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-white/20" />
  </RadixSlider.Root>
);

export default Slider;
