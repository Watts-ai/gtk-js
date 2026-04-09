use relm4::prelude::*;

pub struct LabelWrapWord;

#[relm4::component(pub)]
impl SimpleComponent for LabelWrapWord {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Label {
            set_label: "The quick brown fox jumps over the lazy dog near the river",
            set_wrap: true,
            set_wrap_mode: gtk::pango::WrapMode::Word,
            set_max_width_chars: 15,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
