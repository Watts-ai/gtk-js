use relm4::adw;
use relm4::prelude::*;

pub struct WindowTitleLongText;

#[relm4::component(pub)]
impl SimpleComponent for WindowTitleLongText {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::WindowTitle {
            set_title: "This is a very long window title text",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
