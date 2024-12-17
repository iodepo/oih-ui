'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import TetherComponent from 'react-tether';
import { CSSTransition } from 'react-transition-group';

let activeDropdowns = [];

/*
<Dropdown
  className='browse-menu'
  triggerClassName='browse-button'
  triggerActiveClassName='button--active'
  triggerText='Menu'
  triggerTitle='Toggle menu options'
  direction='down'
  alignment='right' >

  <h6 className='drop__title'>Browse</h6>
  <ul className='drop__menu drop__menu--select'>
    <li><Link to='' className='drop__menu-item' activeClassName='drop__menu-item--active'>Label</Link></li>
  </ul>

</Dropdown>
*/

export default class Dropdown extends React.Component {
  constructor (props) {
    super(props);

    const { id=Date.now().toString() } = this.props;
    this.state = {
      open: false,
      dataRef: id
    };

    this._bodyListener = this._bodyListener.bind(this);
    this._toggleDropdown = this._toggleDropdown.bind(this);
  }

  static closeAll () {
    activeDropdowns.forEach(d => d.close());
  }

  _bodyListener (e) {
    const attrHook = el =>
      el.getAttribute ? el.getAttribute('data-hook') : null;
    // Get the dropdown that is a parent of the clicked element. If any.
    let theSelf = e.target;
    if (
      theSelf.tagName === 'BODY' ||
      theSelf.tagName === 'HTML' ||
      attrHook(theSelf) === 'dropdown:close'
    ) {
      this.close();
      return;
    }

    // If the trigger element is an "a" the target is the "span", but it is a
    // button, the target is the "button" itself.
    // This code handles this case. No idea why this is happening.
    // TODO: Unveil whatever black magic is at work here.
    if (
      theSelf.tagName === 'SPAN' &&
      theSelf.parentNode === this.triggerRef &&
      attrHook(theSelf.parentNode) === 'dropdown:btn'
    ) {
      return;
    }
    if (
      theSelf.tagName === 'SPAN' &&
      attrHook(theSelf.parentNode) === 'dropdown:close'
    ) {
      this.close();
      return;
    }

    if (theSelf && attrHook(theSelf) === 'dropdown:btn') {
      if (theSelf !== this.triggerRef) {
        this.close();
      }
      return;
    }

    do {
      theSelf = theSelf.parentNode;
    } while (
      theSelf &&
      attrHook(theSelf) !== 'dropdown:content' &&
      theSelf.tagName !== 'BODY' &&
      theSelf.tagName !== 'HTML'
    );

    if (theSelf.getAttribute('data-ref') !== this.state.dataRef) {
      this.close();
    }
  }

  _toggleDropdown (e) {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    this.toggle();
  }

  // Lifecycle method.
  // Called once as soon as the component has a DOM representation.
  componentDidMount () {
    activeDropdowns.push(this);
    window.addEventListener('click', this._bodyListener);
  }

  // Lifecycle method.
  componentWillUnmount () {
    activeDropdowns.splice(activeDropdowns.indexOf(this), 1);
    window.removeEventListener('click', this._bodyListener);
  }

  toggle () {
    this.setState({ open: !this.state.open });
  }

  open () {
    !this.state.open && this.setState({ open: true });
  }

  close () {
    this.state.open && this.setState({ open: false });
  }

  renderTriggerElement (ref) {
    const {
      triggerTitle,
      triggerText,
      triggerClassName,
      triggerActiveClassName,
      triggerElement: TriggerElement
    } = this.props;

    this.triggerRef = ref;

    let triggerKlasses = ['drop__toggle'];
    let triggerProps = {
      onClick: this._toggleDropdown,
      'data-hook': 'dropdown:btn',
    };

    if (triggerClassName) {
      triggerKlasses.push(triggerClassName);
    }

    if (this.state.open && triggerActiveClassName) {
      triggerKlasses.push(triggerActiveClassName);
    }

    triggerProps.className = triggerKlasses.join(' ');

    // Additional trigger props.
    if (triggerTitle) {
      triggerProps.title = triggerTitle;
    }

    return (
      <TriggerElement
        ref={ref}
        {...triggerProps}>
        <span>{triggerText}</span>
      </TriggerElement>
    );
  }

  renderContent (ref) {
    const { direction, className } = this.props;
    const { dataRef } = this.state;

    // Base and additional classes for the trigger and the content.
    let klasses = [
      'drop__content',
      'drop__content--react',
      `drop-trans--${direction}`
    ];
    let dropdownContentProps = {
      'data-hook': 'dropdown:content',
      'data-ref': dataRef,
    };

    if (className) {
      klasses.push(className);
    }

    dropdownContentProps.className = klasses.join(' ');

    return (
      <div
        ref = {ref}
      >
        <CSSTransition
          in={this.state.open}
          appear={true}
          unmountOnExit={true}
          classNames='drop-trans'
          timeout={{ enter: 300, exit: 300 }}
          >
          <TransitionItem
            props={dropdownContentProps}
            onChange={this.props.onChange}
            >

            {this.props.children}

          </TransitionItem>
        </CSSTransition>
      </div>
    );
  }

  render () {
    let { alignment, direction } = this.props;

    let allowed;
    if (direction === 'up' || direction === 'down') {
      allowed = ['left', 'center', 'right'];
    } else if (direction === 'left' || direction === 'right') {
      allowed = ['top', 'middle', 'bottom'];
    } else {
      throw new Error(
        `Dropdown: direction "${direction}" is not supported. Use one of: up, down, left, right`
      );
    }

    if (allowed.indexOf(alignment) === -1) {
      throw new Error(
        `Dropdown: alignment "${alignment}" is not supported when direction is ${direction}. Use one of: ${allowed.join(
          ', '
        )}`
      );
    }

    let tetherAttachment;
    let tetherTargetAttachment;
    switch (direction) {
      case 'up':
        tetherAttachment = `bottom ${alignment}`;
        tetherTargetAttachment = `top ${alignment}`;
        break;
      case 'down':
        tetherAttachment = `top ${alignment}`;
        tetherTargetAttachment = `bottom ${alignment}`;
        break;
      case 'right':
        tetherAttachment = `${alignment} left`;
        tetherTargetAttachment = `${alignment} right`;
        break;
      case 'left':
        tetherAttachment = `${alignment} right`;
        tetherTargetAttachment = `${alignment} left`;
        break;
    }

    // attachment={tetherAttachment}
    // targetAttachment={tetherTargetAttachment}
    return (
      <TetherComponent
        // attachment is the content.
        attachment={tetherAttachment}
        // targetAttachment is the trigger
        targetAttachment={tetherTargetAttachment}
        constraints={[
          {
            to: 'window',
            attachment: 'together'
          }
        ]}
        renderTarget = { ref => (this.renderTriggerElement(ref))}
        renderElement = { ref => (this.state.open && this.renderContent(ref))}
      >
      </TetherComponent>
    );
  }
}

Dropdown.defaultProps = {
  triggerElement: 'button',
  direction: 'down',
  alignment: 'center'
};

if (process.env.NODE_ENV !== 'production') {
  Dropdown.propTypes = {
    id: T.string,
    onChange: T.func,

    triggerElement: T.oneOf(['a', 'button']),
    triggerClassName: T.string,
    triggerActiveClassName: T.string,
    triggerTitle: T.string,
    triggerText: T.oneOfType([T.string, T.number]).isRequired,

    direction: T.oneOf(['up', 'down', 'left', 'right']),
    alignment: T.oneOf(['left', 'center', 'right', 'top', 'middle', 'bottom']),

    className: T.string,
    children: T.node
  };
}

class TransitionItem extends React.Component {
  componentDidMount () {
    this.props.onChange && this.props.onChange(true);
  }

  componentWillUnmount () {
    this.props.onChange && this.props.onChange(false);
  }

  render () {
    return <div {...this.props.props}>{this.props.children}</div>;
  }
}

if (process.env.NODE_ENV !== 'production') {
  TransitionItem.propTypes = {
    onChange: T.func,
    props: T.object,
    children: T.node
  };
}
