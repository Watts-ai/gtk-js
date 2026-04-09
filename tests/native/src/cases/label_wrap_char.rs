use relm4::prelude::*;

pub struct LabelWrapChar;

#[relm4::component(pub)]
impl SimpleComponent for LabelWrapChar {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Label {
            set_label: "Thequickbrownfoxjumps",
            set_wrap: true,
            set_wrap_mode: gtk::pango::WrapMode::Char,
            set_max_width_chars: 10,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
