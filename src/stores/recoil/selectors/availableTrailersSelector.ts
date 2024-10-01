import { selector } from "recoil";
import { trailersAtom } from "../atoms/trailersAtom";

export const availableTrailersSelector = selector({
  key: "availableTrailersSelector",
  get: ({ get }) => {
    const trailers: any[] = get(trailersAtom);
    return trailers.filter((trailer) => trailer.isAvailable); // Only available trailers
  },
});
