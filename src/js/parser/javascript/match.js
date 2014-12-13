import _ from 'lodash';
import Q from 'q';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'match',

  _render() {
    var start, end,
        parts = this.parts(),
        partPromises;

    if (this.anchorStart()) {
      start = this.renderLabel('Start of line').then(label => {
        return label.addClass('anchor');
      });
    }

    if (this.anchorEnd()) {
      end = this.renderLabel('End of line').then(label => {
        return label.addClass('anchor');
      });
    }

    if (start || end || parts.length !== 1) {
      partPromises = _.map(parts, (function(part) {
        return part.render(this.container.group());
      }).bind(this));

      return Q.all(_([start, partPromises, end]).flatten().compact().value())
        .then(((items) => {
          this.spaceHorizontally(items, {
            padding: 10
          });
        }).bind(this));
    } else {
      return this.proxy(parts[0]);
    }
  },

  anchorStart() {
    return this._anchor_start.textValue !== '';
  },

  anchorEnd() {
    return this._anchor_end.textValue !== '';
  },

  parts() {
    return _.reduce(this._parts.elements, function(result, node) {
      var last = _.last(result);

      if (last && node.elements[0].type === 'literal' && node.elements[1].textValue === '' && last.elements[0].type === 'literal' && last.elements[1].textValue === '') {
        last.textValue += node.textValue;
        last.elements[0].textValue += node.elements[0].textValue;
        last.elements[0].literal.textValue += node.elements[0].literal.textValue;
      } else {
        result.push(node);
      }

      return result;
    }, []);
  }
});
