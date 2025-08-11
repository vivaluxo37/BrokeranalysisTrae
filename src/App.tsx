import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { 
  AboutPage, 
  BrokerDirectoryPage, 
  BrokerProfilePage, 
  BrokerReviews, 
  BrokerWizardPage, 
  HomePage,
  InteractiveBrokersReview,
  ToolsLandingPage
} from './pages'
import BrokerCardIntegrationTest from './pages/test/BrokerCardIntegrationTest'
import BrokerComparisonIntegrationTest from './pages/test/BrokerComparisonIntegrationTest'

// Import all broker pages
import ActivtradesPage from './pages/brokers/activtrades';
import AdmiralsAdmiralMarketsPage from './pages/brokers/admirals-admiral-markets';
import AjBellYouinvestPage from './pages/brokers/aj-bell-youinvest';
import AllyInvestPage from './pages/brokers/ally-invest';
import AlpacaTradingPage from './pages/brokers/alpaca-trading';
import AmpFuturesPage from './pages/brokers/amp-futures';
import AvatradePage from './pages/brokers/avatrade';
import AxitraderPage from './pages/brokers/axitrader';
import BarclaysPage from './pages/brokers/barclays';
import BlackbullMarketsPage from './pages/brokers/blackbull-markets';
import BnpParibasPage from './pages/brokers/bnp-paribas';
import Broker16Page from './pages/brokers/broker-16';
import Broker21Page from './pages/brokers/broker-21';
import Broker24Page from './pages/brokers/broker-24';
import Broker27Page from './pages/brokers/broker-27';
import Broker34Page from './pages/brokers/broker-34';
import Broker37Page from './pages/brokers/broker-37';
import Broker490Page from './pages/brokers/broker-490';
import Broker50Page from './pages/brokers/broker-50';
import Broker56Page from './pages/brokers/broker-56';
import Broker67Page from './pages/brokers/broker-67';
import Broker76Page from './pages/brokers/broker-76';
import Broker9Page from './pages/brokers/broker-9';
import CapitalcomPage from './pages/brokers/capitalcom';
import CaptraderPage from './pages/brokers/captrader';
import CharlesSchwabPage from './pages/brokers/charles-schwab';
import CharlesStanleyDirectPage from './pages/brokers/charles-stanley-direct';
import ChoicetradePage from './pages/brokers/choicetrade';
import CiticSecuritiesPage from './pages/brokers/citic-securities';
import CityIndexPage from './pages/brokers/city-index';
import ComdirectPage from './pages/brokers/comdirect';
import DavySelectPage from './pages/brokers/davy-select';
import DegiroPage from './pages/brokers/degiro';
import ETradePage from './pages/brokers/e-trade';
import EasyequitiesPage from './pages/brokers/easyequities';
import EightcapPage from './pages/brokers/eightcap';
import EtoroPage from './pages/brokers/etoro';
import ExnessPage from './pages/brokers/exness';
import FbsPage from './pages/brokers/fbs';
import FidelityInternationalPage from './pages/brokers/fidelity-international';
import FidelityPage from './pages/brokers/fidelity';
import FirstradePage from './pages/brokers/firstrade';
import FlatexPage from './pages/brokers/flatex';
import ForexComPage from './pages/brokers/forex.com';
import FpMarketsPage from './pages/brokers/fp-markets';
import FreetradePage from './pages/brokers/freetrade';
import FusionMarketsPage from './pages/brokers/fusion-markets';
import FxcmPage from './pages/brokers/fxcm';
import FxproPage from './pages/brokers/fxpro';
import FxtmPage from './pages/brokers/fxtm';
import FxtradingcomPage from './pages/brokers/fxtradingcom';
import GlobalPrimePage from './pages/brokers/global-prime';
import GoMarketsPage from './pages/brokers/go-markets';
import HalifaxPage from './pages/brokers/halifax';
import HantecMarketsPage from './pages/brokers/hantec-markets';
import HargreavesLansdownPage from './pages/brokers/hargreaves-lansdown';
import HycmPage from './pages/brokers/hycm';
import IndexPage from './pages/brokers/index';
import InteractiveBrokersPage from './pages/brokers/interactive-brokers';
import InteractiveInvestorPage from './pages/brokers/interactive-investor';
import JpMorganSelfDirectedInvestingPage from './pages/brokers/jp-morgan-self-directed-investing';
import LightyearPage from './pages/brokers/lightyear';
import LynxPage from './pages/brokers/lynx';
import MarketsxPage from './pages/brokers/marketsx';
import MerrillEdgePage from './pages/brokers/merrill-edge';
import MexemPage from './pages/brokers/mexem';
import MonetaMarketsPage from './pages/brokers/moneta-markets';
import MoomooPage from './pages/brokers/moomoo';
import MultibankPage from './pages/brokers/multibank';
import NinjatraderPage from './pages/brokers/ninjatrader';
import OandaPage from './pages/brokers/oanda';
import OptimusFuturesPage from './pages/brokers/optimus-futures';
import PepperstonePage from './pages/brokers/pepperstone';
import Plus500Page from './pages/brokers/plus500';
import PubliccomPage from './pages/brokers/publiccom';
import QuestradePage from './pages/brokers/questrade';
import RevolutPage from './pages/brokers/revolut';
import RobinhoodPage from './pages/brokers/robinhood';
import RoyalPage from './pages/brokers/royal';
import SaxoBankPage from './pages/brokers/saxo-bank';
import SharekhanPage from './pages/brokers/sharekhan';
import SkillingPage from './pages/brokers/skilling';
import SofiInvestPage from './pages/brokers/sofi-invest';
import SogotradePage from './pages/brokers/sogotrade';
import SpreadexPage from './pages/brokers/spreadex';
import StakePage from './pages/brokers/stake';
import SwissquotePage from './pages/brokers/swissquote';
import TastytradePage from './pages/brokers/tastytrade';
import TickmillPage from './pages/brokers/tickmill';
import TmgmPage from './pages/brokers/tmgm';
import TradeNationPage from './pages/brokers/trade-nation';
import TradeRepublicPage from './pages/brokers/trade-republic';
import TradestationPage from './pages/brokers/tradestation';
import TradezeroPage from './pages/brokers/tradezero';
import TradierPage from './pages/brokers/tradier';
import Trading212Page from './pages/brokers/trading-212';
import VanguardPage from './pages/brokers/vanguard';
import VantageMarketsPage from './pages/brokers/vantage-markets';
import VtMarketsPage from './pages/brokers/vt-markets';
import WebullPage from './pages/brokers/webull';
import XmPage from './pages/brokers/xm';
import XtbPage from './pages/brokers/xtb';
import ZacksTradePage from './pages/brokers/zacks-trade';
import ZerodhaPage from './pages/brokers/zerodha';

// Import comparison pages
import BestOnlineBrokersPage from './pages/comparison/best-online-brokers'
import BestForexBrokersPage from './pages/comparison/best-forex-brokers'
import BestStockBrokersPage from './pages/comparison/best-stock-brokers'
import BestCfdBrokersPage from './pages/comparison/best-cfd-brokers'
import BestBeginnerBrokersPage from './pages/comparison/best-beginner-brokers'
import BestDayTradingBrokersPage from './pages/comparison/best-day-trading-brokers'
import BestOptionsTradingBrokersPage from './pages/comparison/best-options-trading-brokers'
import BestCryptoBrokersPage from './pages/comparison/best-crypto-brokers'
import BestFuturesBrokersPage from './pages/comparison/best-futures-brokers'
import BestLowCostBrokersPage from './pages/comparison/best-low-cost-brokers'

// Import tool pages
import FindMyBrokerPage from './pages/tools/find-my-broker'
import BrokerageFeeCalculatorPage from './pages/tools/brokerage-fee-calculator'
import SpreadComparisonPage from './pages/tools/spread-comparison'
import LeverageCalculatorPage from './pages/tools/leverage-calculator'

// Import education pages
import EducationHub from './pages/education/EducationHub'
import TradingGlossary from './pages/education/TradingGlossary'
import HowToChooseBroker2025 from './pages/education/articles/HowToChooseBroker2025'
import UnderstandingForexSpreads from './pages/education/articles/UnderstandingForexSpreads'
import CFDTradingGuide2025 from './pages/education/articles/CFDTradingGuide2025'
import RiskManagementStrategies from './pages/education/articles/RiskManagementStrategies'

// Import news pages
import NewsHub from './pages/news/NewsHub'

// Import country pages
import UnitedStatesPage from './pages/countries/united-states'
import UnitedKingdomPage from './pages/countries/united-kingdom'
import AustraliaPage from './pages/countries/australia'
import CanadaPage from './pages/countries/canada'
import GermanyPage from './pages/countries/germany'
import FrancePage from './pages/countries/france'
import SingaporePage from './pages/countries/singapore'
import JapanPage from './pages/countries/japan'

import './index.css'

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <NavigationProvider enableAnalytics={true} maxAnalyticsEvents={1000}>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/compare" element={<BrokerDirectoryPage />} />
        <Route path="/compare/wizard" element={<BrokerWizardPage />} />
        <Route path="/education" element={<EducationHub />} />
        <Route path="/news" element={<NewsHub />} />
        <Route path="/community" element={<ToolsLandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Generic Broker Routes */}
        <Route path="/broker/:id" element={<BrokerProfilePage />} />
        <Route path="/brokers/:id" element={<BrokerProfilePage />} />
        <Route path="/broker-reviews" element={<BrokerReviews />} />
        <Route path="/broker-reviews/interactive-brokers" element={<InteractiveBrokersReview />} />
        
        {/* Specific Broker Pages */}
        <Route path="/brokers/activtrades" element={<ActivtradesPage />} />
        <Route path="/brokers/admirals-admiral-markets" element={<AdmiralsAdmiralMarketsPage />} />
        <Route path="/brokers/aj-bell-youinvest" element={<AjBellYouinvestPage />} />
        <Route path="/brokers/ally-invest" element={<AllyInvestPage />} />
        <Route path="/brokers/alpaca-trading" element={<AlpacaTradingPage />} />
        <Route path="/brokers/amp-futures" element={<AmpFuturesPage />} />
        <Route path="/brokers/avatrade" element={<AvatradePage />} />
        <Route path="/brokers/axitrader" element={<AxitraderPage />} />
        <Route path="/brokers/barclays" element={<BarclaysPage />} />
        <Route path="/brokers/blackbull-markets" element={<BlackbullMarketsPage />} />
        <Route path="/brokers/bnp-paribas" element={<BnpParibasPage />} />
        <Route path="/brokers/broker-16" element={<Broker16Page />} />
        <Route path="/brokers/broker-21" element={<Broker21Page />} />
        <Route path="/brokers/broker-24" element={<Broker24Page />} />
        <Route path="/brokers/broker-27" element={<Broker27Page />} />
        <Route path="/brokers/broker-34" element={<Broker34Page />} />
        <Route path="/brokers/broker-37" element={<Broker37Page />} />
        <Route path="/brokers/broker-490" element={<Broker490Page />} />
        <Route path="/brokers/broker-50" element={<Broker50Page />} />
        <Route path="/brokers/broker-56" element={<Broker56Page />} />
        <Route path="/brokers/broker-67" element={<Broker67Page />} />
        <Route path="/brokers/broker-76" element={<Broker76Page />} />
        <Route path="/brokers/broker-9" element={<Broker9Page />} />
        <Route path="/brokers/capitalcom" element={<CapitalcomPage />} />
        <Route path="/brokers/captrader" element={<CaptraderPage />} />
        <Route path="/brokers/charles-schwab" element={<CharlesSchwabPage />} />
        <Route path="/brokers/charles-stanley-direct" element={<CharlesStanleyDirectPage />} />
        <Route path="/brokers/choicetrade" element={<ChoicetradePage />} />
        <Route path="/brokers/citic-securities" element={<CiticSecuritiesPage />} />
        <Route path="/brokers/city-index" element={<CityIndexPage />} />
        <Route path="/brokers/comdirect" element={<ComdirectPage />} />
        <Route path="/brokers/davy-select" element={<DavySelectPage />} />
        <Route path="/brokers/degiro" element={<DegiroPage />} />
        <Route path="/brokers/e-trade" element={<ETradePage />} />
        <Route path="/brokers/easyequities" element={<EasyequitiesPage />} />
        <Route path="/brokers/eightcap" element={<EightcapPage />} />
        <Route path="/brokers/etoro" element={<EtoroPage />} />
        <Route path="/brokers/exness" element={<ExnessPage />} />
        <Route path="/brokers/fbs" element={<FbsPage />} />
        <Route path="/brokers/fidelity-international" element={<FidelityInternationalPage />} />
        <Route path="/brokers/fidelity" element={<FidelityPage />} />
        <Route path="/brokers/firstrade" element={<FirstradePage />} />
        <Route path="/brokers/flatex" element={<FlatexPage />} />
        <Route path="/brokers/forex.com" element={<ForexComPage />} />
        <Route path="/brokers/fp-markets" element={<FpMarketsPage />} />
        <Route path="/brokers/freetrade" element={<FreetradePage />} />
        <Route path="/brokers/fusion-markets" element={<FusionMarketsPage />} />
        <Route path="/brokers/fxcm" element={<FxcmPage />} />
        <Route path="/brokers/fxpro" element={<FxproPage />} />
        <Route path="/brokers/fxtm" element={<FxtmPage />} />
        <Route path="/brokers/fxtradingcom" element={<FxtradingcomPage />} />
        <Route path="/brokers/global-prime" element={<GlobalPrimePage />} />
        <Route path="/brokers/go-markets" element={<GoMarketsPage />} />
        <Route path="/brokers/halifax" element={<HalifaxPage />} />
        <Route path="/brokers/hantec-markets" element={<HantecMarketsPage />} />
        <Route path="/brokers/hargreaves-lansdown" element={<HargreavesLansdownPage />} />
        <Route path="/brokers/hycm" element={<HycmPage />} />
        <Route path="/brokers/index" element={<IndexPage />} />
        <Route path="/brokers/interactive-brokers" element={<InteractiveBrokersPage />} />
        <Route path="/brokers/interactive-investor" element={<InteractiveInvestorPage />} />
        <Route path="/brokers/jp-morgan-self-directed-investing" element={<JpMorganSelfDirectedInvestingPage />} />
        <Route path="/brokers/lightyear" element={<LightyearPage />} />
        <Route path="/brokers/lynx" element={<LynxPage />} />
        <Route path="/brokers/marketsx" element={<MarketsxPage />} />
        <Route path="/brokers/merrill-edge" element={<MerrillEdgePage />} />
        <Route path="/brokers/mexem" element={<MexemPage />} />
        <Route path="/brokers/moneta-markets" element={<MonetaMarketsPage />} />
        <Route path="/brokers/moomoo" element={<MoomooPage />} />
        <Route path="/brokers/multibank" element={<MultibankPage />} />
        <Route path="/brokers/ninjatrader" element={<NinjatraderPage />} />
        <Route path="/brokers/oanda" element={<OandaPage />} />
        <Route path="/brokers/optimus-futures" element={<OptimusFuturesPage />} />
        <Route path="/brokers/pepperstone" element={<PepperstonePage />} />
        <Route path="/brokers/plus500" element={<Plus500Page />} />
        <Route path="/brokers/publiccom" element={<PubliccomPage />} />
        <Route path="/brokers/questrade" element={<QuestradePage />} />
        <Route path="/brokers/revolut" element={<RevolutPage />} />
        <Route path="/brokers/robinhood" element={<RobinhoodPage />} />
        <Route path="/brokers/royal" element={<RoyalPage />} />
        <Route path="/brokers/saxo-bank" element={<SaxoBankPage />} />
        <Route path="/brokers/sharekhan" element={<SharekhanPage />} />
        <Route path="/brokers/skilling" element={<SkillingPage />} />
        <Route path="/brokers/sofi-invest" element={<SofiInvestPage />} />
        <Route path="/brokers/sogotrade" element={<SogotradePage />} />
        <Route path="/brokers/spreadex" element={<SpreadexPage />} />
        <Route path="/brokers/stake" element={<StakePage />} />
        <Route path="/brokers/swissquote" element={<SwissquotePage />} />
        <Route path="/brokers/tastytrade" element={<TastytradePage />} />
        <Route path="/brokers/tickmill" element={<TickmillPage />} />
        <Route path="/brokers/tmgm" element={<TmgmPage />} />
        <Route path="/brokers/trade-nation" element={<TradeNationPage />} />
        <Route path="/brokers/trade-republic" element={<TradeRepublicPage />} />
        <Route path="/brokers/tradestation" element={<TradestationPage />} />
        <Route path="/brokers/tradezero" element={<TradezeroPage />} />
        <Route path="/brokers/tradier" element={<TradierPage />} />
        <Route path="/brokers/trading-212" element={<Trading212Page />} />
        <Route path="/brokers/vanguard" element={<VanguardPage />} />
        <Route path="/brokers/vantage-markets" element={<VantageMarketsPage />} />
        <Route path="/brokers/vt-markets" element={<VtMarketsPage />} />
        <Route path="/brokers/webull" element={<WebullPage />} />
        <Route path="/brokers/xm" element={<XmPage />} />
        <Route path="/brokers/xtb" element={<XtbPage />} />
        <Route path="/brokers/zacks-trade" element={<ZacksTradePage />} />
        <Route path="/brokers/zerodha" element={<ZerodhaPage />} />
        
        {/* Comparison Pages */}
        <Route path="/comparison/best-online-brokers" element={<BestOnlineBrokersPage />} />
        <Route path="/comparison/best-forex-brokers" element={<BestForexBrokersPage />} />
        <Route path="/comparison/best-stock-brokers" element={<BestStockBrokersPage />} />
        <Route path="/comparison/best-cfd-brokers" element={<BestCfdBrokersPage />} />
        <Route path="/comparison/best-beginner-brokers" element={<BestBeginnerBrokersPage />} />
        <Route path="/comparison/best-day-trading-brokers" element={<BestDayTradingBrokersPage />} />
        <Route path="/comparison/best-options-trading-brokers" element={<BestOptionsTradingBrokersPage />} />
        <Route path="/comparison/best-crypto-brokers" element={<BestCryptoBrokersPage />} />
        <Route path="/comparison/best-futures-brokers" element={<BestFuturesBrokersPage />} />
        <Route path="/comparison/best-low-cost-brokers" element={<BestLowCostBrokersPage />} />
        
        {/* Tool Pages */}
        <Route path="/tools/find-my-broker" element={<FindMyBrokerPage />} />
        <Route path="/tools/brokerage-fee-calculator" element={<BrokerageFeeCalculatorPage />} />
        <Route path="/tools/spread-comparison" element={<SpreadComparisonPage />} />
        <Route path="/tools/leverage-calculator" element={<LeverageCalculatorPage />} />
        
        {/* Education Pages */}
        <Route path="/education/trading-glossary" element={<TradingGlossary />} />
        <Route path="/education/how-to-choose-broker-2025" element={<HowToChooseBroker2025 />} />
        <Route path="/education/understanding-forex-spreads" element={<UnderstandingForexSpreads />} />
        <Route path="/education/cfd-trading-guide-2025" element={<CFDTradingGuide2025 />} />
        <Route path="/education/risk-management-strategies" element={<RiskManagementStrategies />} />
        
        {/* Country Pages */}
        <Route path="/countries/united-states" element={<UnitedStatesPage />} />
        <Route path="/countries/united-kingdom" element={<UnitedKingdomPage />} />
        <Route path="/countries/australia" element={<AustraliaPage />} />
        <Route path="/countries/canada" element={<CanadaPage />} />
        <Route path="/countries/germany" element={<GermanyPage />} />
        <Route path="/countries/france" element={<FrancePage />} />
        <Route path="/countries/singapore" element={<SingaporePage />} />
        <Route path="/countries/japan" element={<JapanPage />} />
        
        {/* Test Pages */}
        <Route path="/test/broker-card-integration" element={<BrokerCardIntegrationTest />} />
        <Route path="/test/broker-comparison-integration" element={<BrokerComparisonIntegrationTest />} />
        
        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
        </NavigationProvider>
    </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
