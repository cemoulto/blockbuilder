
/* =========================================================================
 *
 *  editor__html.js
 *  Edit HTML in CodeMirror
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import logger from 'bragi-browser';
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';

import parseCode from '../utils/parseCode.js';

// ========================================================================
//
// Functionality
// ========================================================================
var EditorHTML = React.createClass({

  componentDidMount: function componentDidMount(){
    logger.log('components/EditorHTML:component:componentDidMount', 'called');
    if(this.props.gist){
      this.setupCodeMirror();
    }
  },
  componentDidUpdate: function componentDidUpdate(){
    logger.log('components/EditorHTML:component:componentDidUpdate', 'called');
    if(this.props.gist){
      this.setupCodeMirror();
    }
  },

  /*
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) { 
    logger.log('components/EditorHTML:component:shouldComponentUpdate nextProps: %O', nextProps);
    if(!nextProps) return true;
    var gist = nextProps.gist
    if(!gist || !gist.files || !gist.files[this.props.active]) return true;
    if(gist.files[this.props.active].template === this.props.gist.files[this.props.active].template){
      return false;
    }
    return true;
  },
  */

  // Uility functions
  // ----------------------------------
  setupCodeMirror: function setupCodeMirror(){
    logger.log('components/EditorHTML:component:setupCodeMirror', 'called');

    var gist = this.props.gist;

    // if the element doesn't exist, we're outta here
    if(!document.getElementById('block__code-index')){ return false; }
    // TODO: NOTE: Is just wiping this out efficient? Is there some
    // destructor we need to call instead?
    document.getElementById('block__code-index').innerHTML = '';

    // get text to place in codemirror
    var codeMirrorValue = '';

    if(gist){
      if(!gist.files || !gist.files[this.props.active]){
        codeMirrorValue = 'ERROR: Gist does not have an ' + this.props.active;
      } else {
        codeMirrorValue = gist.files[this.props.active].content;
      }
    }

    // put this behind a request animation frame so we're sure the element
    // is in the DOM
    requestAnimationFrame(()=>{
      this.codeMirror = window.CodeMirror(document.getElementById('block__code-index'), {
        tabSize: 2,
        value: codeMirrorValue,
        mode: 'htmlmixed',
        htmlMode: true,
        lineNumbers: true,
        theme: 'twilight',
        //theme: 'elegant',
        lineWrapping: true,
        viewportMargin: Infinity
      });

      window.Inlet(this.codeMirror);

      this.codeMirror.on('change', ()=>{
        var template = parseCode(this.codeMirror.getValue(), gist.files);
        gist.files[this.props.active].content = this.codeMirror.getValue();
        Actions.localGistUpdate(gist);
      });
    });
  },

  render: function render() {
    return (
      <div id='block__code-index'></div>
    )
  }

})

export default EditorHTML;