/**
 * SVG Mock for Jest Tests
 * 
 * Mocks SVG imports by returning a simple React component that renders
 * a div with test-friendly attributes for component testing.
 */

const React = require('react');

// Mock SVG as a simple React component
const SvgMock = React.forwardRef(function SvgMock(props, ref) {
  return React.createElement('div', {
    ...props,
    ref,
    'data-testid': props['data-testid'] || 'svg-mock',
    'data-svg': true,
  });
});

SvgMock.displayName = 'SvgMock';

module.exports = SvgMock;
module.exports.default = SvgMock;
