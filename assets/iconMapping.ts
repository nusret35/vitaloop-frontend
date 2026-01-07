import AlcoholIcon from "@/assets/icons/alcohol.svg";
import DrugsIcon from "@/assets/icons/drugs.svg";
import FastFoodIcon from "@/assets/icons/fast-food.svg";
import GamblingIcon from "@/assets/icons/gambling.svg";
import InstagramIcon from "@/assets/icons/instagram.svg";
import LyingIcon from "@/assets/icons/lying.svg";
import OverfeedingIcon from "@/assets/icons/overfeeding.svg";
import PillsIcon from "@/assets/icons/pills.svg";
import PornIcon from "@/assets/icons/porn.svg";
import RedditIcon from "@/assets/icons/reddit.svg";
import ShoppingIcon from "@/assets/icons/shopping.svg";
import SmokingIcon from "@/assets/icons/smoking.svg";
import SodaIcon from "@/assets/icons/soda.svg";
import SugarIcon from "@/assets/icons/sugar.svg";
import TvIcon from "@/assets/icons/tv.svg";
import VideoGamesIcon from "@/assets/icons/video-games.svg";
import WeedIcon from "@/assets/icons/weed.svg";
import BadLanguageIcon from "@/assets/icons/bad-language.svg";
import YouTubeIcon from "@/assets/icons/youtube.svg";
import FacebookIcon from "@/assets/icons/facebook.svg";
import CoffeeIcon from "@/assets/icons/coffee.svg";
import xIcon from "@/assets/icons/x.svg";

import { SvgProps } from "react-native-svg";

const iconMapping: Record<string, React.FC<SvgProps>> = {
  smoking: SmokingIcon,
  alcohol: AlcoholIcon,
  drugs: DrugsIcon,
  fastFood: FastFoodIcon,
  gambling: GamblingIcon,
  instagram: InstagramIcon,
  lying: LyingIcon,
  overfeeding: OverfeedingIcon,
  pills: PillsIcon,
  porn: PornIcon,
  reddit: RedditIcon,
  shopping: ShoppingIcon,
  soda: SodaIcon,
  sugar: SugarIcon,
  tv: TvIcon,
  videoGames: VideoGamesIcon,
  weed: WeedIcon,
  youtube: YouTubeIcon,
  badLanguage: BadLanguageIcon,
  facebook: FacebookIcon,
  coffee: CoffeeIcon,
  x: xIcon,
};

export default iconMapping;
