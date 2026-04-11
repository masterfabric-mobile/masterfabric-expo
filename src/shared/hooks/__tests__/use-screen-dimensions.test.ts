import { renderHook } from '@testing-library/react-native';
import { useScreenDimensions } from '../use-screen-dimensions';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    width: 375,
    height: 812,
    scale: 2,
    fontScale: 1,
  })),
}));

/** Mocked hook — avoid importing RN internal path (no typings in @types/react-native). */
const mockUseWindowDimensions = jest.requireMock<{
  default: jest.Mock;
}>('react-native/Libraries/Utilities/useWindowDimensions').default;

const baseDims = { scale: 2, fontScale: 1 };

describe('useScreenDimensions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct screen data for mobile portrait', () => {
    mockUseWindowDimensions.mockReturnValue({ width: 375, height: 812, ...baseDims });

    const { result } = renderHook(() => useScreenDimensions());

    expect(result.current).toEqual({
      width: 375,
      height: 812,
      isLandscape: false,
      isTablet: false,
    });
  });

  it('returns correct screen data for mobile landscape', () => {
    mockUseWindowDimensions.mockReturnValue({ width: 812, height: 375, ...baseDims });

    const { result } = renderHook(() => useScreenDimensions());

    expect(result.current).toEqual({
      width: 812,
      height: 375,
      isLandscape: true,
      isTablet: false,
    });
  });

  it('returns correct screen data for tablet', () => {
    mockUseWindowDimensions.mockReturnValue({ width: 1024, height: 768, ...baseDims });

    const { result } = renderHook(() => useScreenDimensions());

    expect(result.current).toEqual({
      width: 1024,
      height: 768,
      isLandscape: true,
      isTablet: true,
    });
  });
});
