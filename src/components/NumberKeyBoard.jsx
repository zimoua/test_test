import { createNamespace } from "vant/es/utils";
import { stopPropagation } from "vant/es/utils/dom/event";
import { PortalMixin } from "vant/es/mixins/portal";
import { BindEventMixin } from "vant/es/mixins/bind-event";
import Key from "./Key.jsx";

const [createComponent, bem] = createNamespace("number-keyboard");

export default createComponent({
  mixins: [
    PortalMixin(),
    BindEventMixin(function (bind) {
      if (this.hideOnClickOutside) {
        bind(document.body, "touchstart", this.onBlur);
      }
    })
  ],

  model: {
    event: "update:value"
  },

  props: {
    show: Boolean,
    title: String,
    zIndex: [Number, String],
    randomKeyOrder: Boolean,
    closeButtonText: String,
    deleteButtonText: String,
    closeButtonLoading: Boolean,
    TextBgs: [Object],
    theme: {
      type: String,
      default: "default"
    },
    value: {
      type: String,
      default: ""
    },
    extraKey: {
      type: [String, Array],
      default: ""
    },
    maxlength: {
      type: [Number, String],
      default: Number.MAX_VALUE
    },
    transition: {
      type: Boolean,
      default: true
    },
    showDeleteKey: {
      type: Boolean,
      default: true
    },
    hideOnClickOutside: {
      type: Boolean,
      default: true
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    },
    numberMap: {
      type: Array, // {key:string, url:string}[]
      default: () => []
    }
  },

  watch: {
    show(val) {
      if (!this.transition) {
        this.$emit(val ? "show" : "hide");
      }
    }
  },

  computed: {
    keys() {
      if (this.theme === "custom") {
        return this.genCustomKeys();
      }
      return this.genDefaultKeys();
    }
  },

  methods: {
    genBasicKeys() {
      const keys = [];
      for (let i = 1; i <= 9; i++) {
        keys.push({ text: i, type: "number" });
      }

      if (this.randomKeyOrder) {
        keys.sort(() => (Math.random() > 0.5 ? 1 : -1));
      }

      return keys;
    },

    genDefaultKeys() {
      return [
        ...this.genBasicKeys(),
        { text: this.extraKey, type: "extra" },
        { text: 0 },
        {
          text: this.showDeleteKey ? this.deleteButtonText : "",
          type: this.showDeleteKey ? "delete" : ""
        }
      ];
    },

    genCustomKeys() {
      const keys = this.genBasicKeys();
      const { extraKey } = this;
      const extraKeys = Array.isArray(extraKey) ? extraKey : [extraKey];

      if (extraKeys.length === 1) {
        keys.push(
          { text: 0, wider: true },
          { text: extraKeys[0], type: "extra" }
        );
      } else if (extraKeys.length === 2) {
        keys.push(
          { text: extraKeys[0], type: "extra" },
          { text: 0 },
          { text: extraKeys[1], type: "extra" }
        );
      }

      return keys;
    },

    onBlur() {
      this.show && this.$emit("blur");
    },

    onClose() {
      this.$emit("close");
      this.onBlur();
    },

    onAnimationEnd() {
      this.$emit(this.show ? "show" : "hide");
    },

    onPress(text, type) {
      if (text === "") {
        if (type === "extra") {
          this.onBlur();
        }
        return;
      }

      const { value } = this;

      if (type === "delete") {
        this.$emit("delete");
        this.$emit("update:value", value.slice(0, value.length - 1));
      } else if (type === "close") {
        this.onClose();
      } else if (value.length < this.maxlength) {
        this.$emit("input", text);
        this.$emit("update:value", value + text);
      }
    },

    genTitle() {
      const { title, theme, closeButtonText } = this;
      const titleLeft = this.slots("title-left");
      const showClose = closeButtonText && theme === "default";
      const showTitle = title || showClose || titleLeft;

      if (!showTitle) {
        return;
      }

      return (
        <div class={bem("header")}>
          {titleLeft && <span class={bem("title-left")}>{titleLeft}</span>}
          {title && <h2 class={bem("title")}>{title}</h2>}
          {showClose && (
            <button type="button" class={bem("close")} onClick={this.onClose}>
              {closeButtonText}
            </button>
          )}
        </div>
      );
    },

    genKeys() {
      const numberMap = this.numberMap;
      console.log(numberMap);
      return this.keys.map((key) => {
        console.log(key.text);
        console.log(numberMap[key.text]);
        return (
          <Key
            key={key.text}
            text={numberMap[key.text]?.key || key.text}
            type={key.type}
            wider={key.wider}
            color={key.color}
            onPress={this.onPress}
          >
            {(() => {
              if (key.type === "delete") {
                return this.slots("delete");
              }
              if (key.type === "extra") {
                return this.slots("extra-key");
              }
              return <div>{numberMap[key.text]?.url || key.text}</div>;
            })()}
          </Key>
        );
      });
    },

    genSidebar() {
      if (this.theme === "custom") {
        return (
          <div class={bem("sidebar")}>
            {this.showDeleteKey && (
              <Key
                large
                text={this.deleteButtonText}
                type="delete"
                onPress={this.onPress}
              >
                {this.slots("delete")}
              </Key>
            )}
            <Key
              large
              text={this.closeButtonText}
              type="close"
              color="blue"
              loading={this.closeButtonLoading}
              onPress={this.onPress}
            />
          </div>
        );
      }
    }
  },

  render() {
    const Title = this.genTitle();

    return (
      <transition name={this.transition ? "van-slide-up" : ""}>
        <div
          vShow={this.show}
          style={{ zIndex: this.zIndex }}
          class={bem({ unfit: !this.safeAreaInsetBottom, "with-title": Title })}
          onTouchstart={stopPropagation}
          onAnimationend={this.onAnimationEnd}
          onWebkitAnimationEnd={this.onAnimationEnd}
        >
          {Title}
          <div class={bem("body")}>
            <div class={bem("keys")}>{this.genKeys()}</div>
            {this.genSidebar()}
          </div>
        </div>
      </transition>
    );
  }
});
