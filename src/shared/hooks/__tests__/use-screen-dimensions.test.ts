import { renderHook } from '@testing-library/react-native';
import { useScreenDimensions } from '../use-screen-dimensions';

// Mock useWindowDimensions
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  useWindowDimensions: jest.fn(),
}));

const mockUseWindowDimensions = require('react-native').useWindowDimensions;

describe('useScreenDimensions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct screen data for mobile portrait', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 375,
      height: 812,
    });

    const { result } = renderHook(() => useScreenDimensions());

    expect(result.current).toEqual({
      width: 375,
      height: 812,
      isLandscape: false,
      isTablet: false,
    });
  });

  it('returns correct screen data for mobile landscape', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 812,
      height: 375,
    });

    const { result } = renderHook(() => useScreenDimensions());

    expect(result.current).toEqual({
      width: 812,
      height: 375,
      isLandscape: true,
      isTablet: false,
    });
  });

  it('returns correct screen data for tablet', () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 1024,
      height: 768,
    });

    const { result } = renderHook(() => useScreenDimensions());

    expect(result.current).toEqual({
      width: 1024,
      height: 768,
      isLandscape: true,
      isTablet: true,
    });
  });
});
