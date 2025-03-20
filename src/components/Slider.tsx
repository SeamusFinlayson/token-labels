import * as RadixSlider from "@radix-ui/react-slider";

const Slider = (sliderProps: RadixSlider.SliderProps) => (
  <RadixSlider.Root
    className="relative flex h-5 w-full touch-none select-none items-center"
    {...sliderProps}
  >
    <RadixSlider.Track className="relative h-[4px] grow rounded-full bg-mirage-50 dark:bg-mirage-950">
      <RadixSlider.Range className="absolute h-full rounded-full bg-primary/60 dark:bg-primary-dark/60" />
    </RadixSlider.Track>
    <RadixSlider.Thumb className="block size-5 rounded-[10px] bg-primary shadow-xl outline-hidden outline-4 outline-offset-0 focus-visible:outline focus-visible:outline-white/20 dark:bg-primary-dark" />
  </RadixSlider.Root>
);

export default Slider;
